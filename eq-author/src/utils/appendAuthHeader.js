export default headers => {
  if (!window.localStorage) {
    return {
      headers: {
        ...headers
      }
    };
  }
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
