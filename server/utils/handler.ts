import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import type { EventHandler, EventHandlerRequest } from 'h3';

const SERVER_PRIVATE_KEY = useRuntimeConfig().serverPrivateKey;

// 解密 RSA 加密的 AES 密钥
function decryptAESKey(encryptedAESKey: string): string {
  const privateKey = forge.pki.privateKeyFromPem(SERVER_PRIVATE_KEY);
  const encryptedBuffer = forge.util.decode64(encryptedAESKey); // Base64 解码
  return privateKey.decrypt(encryptedBuffer, 'RSA-OAEP', {
    md: forge.md.sha256.create() // 使用 SHA-256 作为哈希算法
  });
}

// 使用 AES 解密数据
function decryptDataWithAES(encryptedData: string, aesKey: string, iv: string): string {
  const decipher = forge.cipher.createDecipher('AES-CBC', aesKey);
  decipher.start({ iv: forge.util.decode64(iv) }); // Base64 解码 IV
  decipher.update(forge.util.createBuffer(forge.util.decode64(encryptedData))); // Base64 解码数据
  const success = decipher.finish();
  if (!success) {
    throw createError({ statusCode: 400, message: 'AES decryption failed' });
  }
  return decipher.output.toString();
}

// 校验数据完整性
function verifyHash(data: string, hash: string): void {
  const dataHash = CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  if (dataHash !== hash) {
    throw createError({ statusCode: 400, message: 'Invalid hash, data integrity check failed' });
  }
}

// 解密请求数据
async function decryptRequest(event: any): Promise<any> {
  // 从查询参数中获取加密数据
  let payload = null;
  if (['get', 'delete'].includes(event.method.toLowerCase())) {
    payload = getQuery(event);
    if (payload.isEncrypted !== 'true') {
      // 如果未加密，直接返回原始数据
      return JSON.parse(payload.encryptedData as string);
    }
  } else {
    payload = await readBody(event);
    if (!payload.isEncrypted) {
      // 如果未加密，直接返回原始数据
      return payload.encryptedData;
    }
  }

  // 解密 AES 密钥
  const aesKey = decryptAESKey(payload.encryptedAESKey);

  // 使用 AES 解密数据
  const decryptedData = decryptDataWithAES(payload.encryptedData, aesKey, payload.iv);

  // 校验数据完整性
  verifyHash(decryptedData, payload.hash);
  // 返回解密后的数据
  return JSON.parse(decodeURIComponent(decryptedData));
}

// 包装响应处理器
export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async (event) => {
    try {
      // 解密请求数据
      event.context.decryptedData = await decryptRequest(event);

      // 调用实际的处理器
      const response = await handler(event);

      // 返回处理结果
      return response;
    } catch (error: any) {
      // 错误处理
      if (import.meta.env.PROD) {
        throw createError({
          statusCode: error.statusCode || 500,
          statusMessage: error.statusMessage || 'Internal Server Error',
          message: error.statusMessage
        });
      }
      throw error; // 开发环境直接抛出错误
    }
  });
