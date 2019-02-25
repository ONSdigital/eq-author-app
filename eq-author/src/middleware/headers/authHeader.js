export default headers => {
  if (!window.localStorage) {
    return {
      ...headers,
    };
  }
  const accessToken = localStorage.getItem("accessToken");
  const returnedHeaders = {
    ...headers,
  };

  if (accessToken) {
    returnedHeaders.authorization = `Bearer ${accessToken}`;
  }

  return {
    ...returnedHeaders,
  };
};
