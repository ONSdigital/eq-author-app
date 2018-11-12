export default (client, mutation) => options =>
  client.mutate({
    mutation,
    ...options
  });
