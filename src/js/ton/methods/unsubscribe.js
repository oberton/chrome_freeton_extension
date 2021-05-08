export default async function unsubscribe(handle) {
  const result = await conf.tonClient.net.unsubscribe({handle});
  return result;
}
