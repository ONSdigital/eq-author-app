const searchByFolderTitleOrShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const filteredData = data.map(({ folders, ...rest }) => ({
    folders: folders.filter(({ alias, title, displayName }) =>
      `${alias ? alias : ""} ${title ? title : displayName}`
        .toLowerCase()
        .includes(lowerCaseSearchTerm)
    ),
    ...rest,
  }));

  return filteredData;
};

export default searchByFolderTitleOrShortCode;
