import { createHash } from 'crypto';
export function getFileExtension(fileName: string, withDot = false): string {
  if (!fileName.includes('.')) return '';
  return withDot ? `.${fileName.split('.').pop()}` : '';
}

export function calcFileHash(file: Buffer): string {
  const hash = createHash('sha256');
  hash.update(file);
  return hash.digest('hex');
}
