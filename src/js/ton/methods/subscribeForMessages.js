export default async function subscribeForMessages(filter, callback = () => true) {

  const result = await conf.tonClient.net.subscribe_collection({
    collection: 'messages',
    filter,
    result: 'id value(format: DEC) src dst created_at msg_type',
  }, callback);

  return result.handle;
}
