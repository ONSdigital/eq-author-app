export default headers => {
  const accessToken = localStorage.getItem("accessToken");
  const returnedHeaders = {
    ...headers
  };

  if (accessToken) {
    returnedHeaders.authorization = `Bearer ${accessToken}`;
  }

  return {
    headers: {
      ...returnedHeaders
    }
  };
};
