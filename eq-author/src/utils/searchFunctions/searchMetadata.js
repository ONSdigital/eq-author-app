const searchMetadata = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const filteredData = data.filter(({ displayName, key }) => {
    return `${displayName ? displayName : ""} ${key ? key : ""}`
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
  });

  return filteredData;
};

export default searchMetadata;
