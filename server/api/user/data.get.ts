export default defineWrappedResponseHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const urlPrefix = runtimeConfig.urlPrefix;
  const body = event.context.decryptedData;
  // const response: CustomResponse<any> = await $fetch(`${urlPrefix}/api/Auth/GetAuthToken`, {
  //   method: 'POST',
  //   body
  // });
  // return response;

  return {
    data: 'This is a test response',
    success: true,
    result: 0,
    text: 'Request was successful'
  } as CustomResponse<string>;
});
