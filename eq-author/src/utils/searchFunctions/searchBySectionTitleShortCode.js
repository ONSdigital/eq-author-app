const searchBySectionTitleOrShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const filteredData = data.filter(({ displayName, alias, title }) => {
    return `${alias ? alias : ""} ${title ? title : displayName}`
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
  });

  return filteredData;
};

export default searchBySectionTitleOrShortCode;
