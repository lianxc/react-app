import path from 'path'
import crypto from 'crypto'

export default function generateScopedName(localName, resourcePath) {
  // 使用相同的算法生成哈希
  const hash = crypto
    .createHash('md5')
    .update(`${path.relative(process.cwd(), resourcePath)}${localName}`)
    .digest('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 5)
  
  return `${localName}-${hash}`
}