// eslint-disable no-underscore-dangle
const getIdForObject = (result) => {
  if (result && result.id && result.__typename) {
    return result.__typename + result.id;
  }
  return null;
};

export default getIdForObject;
