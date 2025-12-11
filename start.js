import { spawn } from 'node:child_process';
import http from 'node:http';

function waitForServer(url, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http
        .get(url, res => {
          if (res.statusCode === 200) resolve();
          else retry();
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

const server = spawn('pnpm', ['dev:server'], { stdio: 'inherit' });

waitForServer('http://localhost:3000')
  .then(() => {
    spawn('pnpm', ['dev:client'], { stdio: 'inherit' });
  })
  .catch(err => console.error(err));
