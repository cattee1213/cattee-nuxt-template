export default defineEventHandler(async (event) => {
  console.log(new Date().toLocaleString() + ' New request from: ' + getRequestURL(event));
  console.log(new Date().toLocaleString() + ' New request to: ' + useRuntimeConfig(event).urlPrefix);
  console.log(new Date().toLocaleString() + ' New request Authorization ' + event.context.headers.Authorization);
  if (['post', 'put'].includes(event.method.toLowerCase())) {
    console.log(new Date().toLocaleString() + ' New request body: ' + JSON.stringify(await readBody(event)));
  }
  if (['get', 'delete'].includes(event.method.toLowerCase())) {
    console.log(new Date().toLocaleString() + ' New request query: ' + JSON.stringify(getQuery(event)));
  }
});
