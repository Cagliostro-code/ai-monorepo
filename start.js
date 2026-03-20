import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import http from 'node:http';

const isWindows = process.platform === 'win32';
const children = new Set();

let shuttingDown = false;

function resolvePnpmCommand() {
  const npmExecPath = process.env.npm_execpath;
  if (npmExecPath?.toLowerCase().includes('pnpm')) {
    return {
      command: process.execPath,
      args: [npmExecPath],
    };
  }

  const nodeDir = dirname(process.execPath);
  const candidates = [
    join(nodeDir, 'node_modules', 'pnpm', 'bin', 'pnpm.cjs'),
    join(nodeDir, '..', 'node_modules', 'pnpm', 'bin', 'pnpm.cjs'),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return {
        command: process.execPath,
        args: [candidate],
      };
    }
  }

  return {
    command: isWindows ? 'pnpm.cmd' : 'pnpm',
    args: [],
  };
}

const pnpm = resolvePnpmCommand();

function waitForServer(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http
        .get(url, res => {
          res.resume();
          resolve();
        })
        .on('error', retry);
    };
    const retry = () => {
      if (Date.now() - start > timeout) reject('Server timeout');
      else setTimeout(check, 500);
    };
    check();
  });
}

function runScript(script) {
  const child = spawn(pnpm.command, [...pnpm.args, 'run', script], {
    stdio: 'inherit',
  });

  child.on('error', error => {
    console.error(`Failed to start ${script}:`, error);
  });

  children.add(child);
  child.once('exit', () => {
    children.delete(child);
  });

  return child;
}

function killProcessTree(child) {
  return new Promise(resolve => {
    const taskkill = spawn('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], {
      stdio: 'ignore',
      windowsHide: true,
    });

    taskkill.once('error', () => {
      child.kill();
      resolve();
    });

    taskkill.once('exit', () => {
      resolve();
    });
  });
}

function stopChild(child) {
  if (child.killed || child.exitCode !== null) {
    return Promise.resolve();
  }

  if (isWindows) {
    return killProcessTree(child);
  }

  child.kill('SIGTERM');
  return Promise.resolve();
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  await Promise.all([...children].map(stopChild));

  process.exitCode = exitCode;
}

const server = runScript('dev:server');
let client;

server.once('exit', code => {
  shutdown(code ?? 0);
});

waitForServer('http://localhost:3000')
  .then(() => {
    if (shuttingDown) {
      return;
    }

    client = runScript('dev:client');
    client.once('exit', code => {
      shutdown(code ?? 0);
    });
  })
  .catch(err => {
    console.error(err);
    shutdown(1);
  });

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    void shutdown(0);
  });
}
