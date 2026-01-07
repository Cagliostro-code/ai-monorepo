import { createHash } from 'crypto';
import fs from 'node:fs';
export function getFileExtension(fileName: string, withDot = false): string {
  if (!fileName.includes('.')) return '';
  return withDot ? `.${fileName.split('.').pop()}` : '';
}

export function calcFileHash(file: Buffer): string {
  const hash = createHash('sha256');
  hash.update(file);
  return hash.digest('hex');
}

/**
 * 覆盖文件 - 使用临时文件保证在写数据时不会因为写入失败导致数据丢失
 * @param filePath
 * @param data
 */
export function coverFile(filePath: string, data: string) {
  const tempName = filePath + '.tmp';
  fs.writeFileSync(tempName, data);
  fs.renameSync(tempName, filePath);
}
