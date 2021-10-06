const searchByQuestionTitleOrShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  const filteredData = data.map(({ folders, ...rest }) => ({
    folders: folders.map(({ pages, ...rest }) => ({
      pages: pages.filter(({ displayName, alias, title }) =>
        `${alias ? alias : ""} ${title ? title : displayName}`
          .toLowerCase()
          .includes(lowerCaseSearchTerm)
      ),
      ...rest,
    })),
    ...rest,
  }));

  return filteredData;
};

export default searchByQuestionTitleOrShortCode;
