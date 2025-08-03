import forge from 'node-forge';
import CryptoJS from 'crypto-js';

export function useEncryptedFetch() {
  // 从环境变量读取服务器公钥
  const SERVER_PUBLIC_KEY = useRuntimeConfig().public.serverPublicKey;
  const encryptRequest = (data: any) => {
    const isProd = import.meta.env.PROD;
    if (!isProd) {
      return { encryptedData: data, isEncrypted: false };
    }

    // 如果data为空 则不加密
    if (!data || Object.keys(data).length === 0) {
      return { encryptedData: data, isEncrypted: false };
    }

    // 生成随机 AES 密钥
    const aesKey = forge.random.getBytesSync(32); // 256 位 AES 密钥

    // 使用 AES 加密数据
    const iv = forge.random.getBytesSync(16); // 初始化向量
    const cipher = forge.cipher.createCipher('AES-CBC', aesKey);

    // 在加密前对数据进行 encodeURIComponent
    const encodedData = encodeURIComponent(JSON.stringify(data));

    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(encodedData));
    cipher.finish();
    const encryptedData = forge.util.encode64(cipher.output.getBytes()); // Base64 编码加密数据

    // 使用 RSA 加密 AES 密钥
    const publicKey = forge.pki.publicKeyFromPem(SERVER_PUBLIC_KEY);
    const encryptedAESKey = forge.util.encode64(
      publicKey.encrypt(aesKey, 'RSA-OAEP', {
        md: forge.md.sha256.create() // 使用 SHA-256 作为哈希算法
      })
    );

    // 计算数据哈希值
    const hash = CryptoJS.SHA256(encodedData).toString(CryptoJS.enc.Hex);

    return {
      encryptedData, // AES 加密后的数据
      encryptedAESKey, // RSA 加密后的 AES 密钥
      iv: forge.util.encode64(iv), // Base64 编码的初始化向量
      hash, // 数据完整性校验的哈希值
      isEncrypted: true
    };
  };

  async function stream(url: string, option: any): Promise<[Response, AbortController]> {
    // 创建 AbortController 实例
    const controller = new AbortController();
    const signal = controller.signal;
    const response = await fetch(
      useRuntimeConfig().public.apiBase + url,
      Object.assign(option, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(encryptRequest(option.body)),
        signal // 将 signal 传递给 fetch
      })
    );
    return [response, controller];
  }

  async function post(url: string, option: any): Promise<CustomResponse<any> | any> {
    const response: CustomResponse<any> = await $fetch(
      url,
      Object.assign(option, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: encryptRequest(option.body)
      })
    );
    handleError(response);
    return response;
  }

  async function get(url: string, option: any = { params: {} }): Promise<CustomResponse<any> | any> {
    const response: CustomResponse<any> = await $fetch(
      url,
      Object.assign(option, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'GET',
        params: encryptRequest(option.params)
      })
    );
    handleError(response);
    return response;
  }

  async function put(url: string, option: any): Promise<CustomResponse<any> | any> {
    const response: CustomResponse<any> = await $fetch(
      url,
      Object.assign(option, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'PUT',
        body: encryptRequest(option.body)
      })
    );
    handleError(response);
    return response;
  }

  async function del(url: string, option: any): Promise<CustomResponse<any> | any> {
    const response: CustomResponse<any> = await $fetch(
      url,
      Object.assign(option, {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'DELETE',
        params: encryptRequest(option.params)
      })
    );
    handleError(response);
    return response;
  }

  function handleError(response: CustomResponse<any>) {
    if (response.result === 401) {
      // 处理未授权错误
      // 例如，重定向到登录页面
      useRouter().push('/login');
    }
  }

  return { post, get, put, del, stream };
}
