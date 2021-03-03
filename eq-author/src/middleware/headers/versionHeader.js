export default (headers) => {
  const { REACT_APP_EQ_AUTHOR_VERSION } = process.env;
  return REACT_APP_EQ_AUTHOR_VERSION
    ? {
        ...headers,
        clientVersion: REACT_APP_EQ_AUTHOR_VERSION,
      }
    : headers;
};
