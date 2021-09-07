const searchByAnswerTitleOrShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  let filteredData = data.map(({ folders, ...rest }) => ({
    ...rest,
    folders: folders.map(({ pages, ...rest }) => ({
      ...rest,
      pages: pages.map(({ answers, ...rest }) => ({
        ...rest,
        answers: answers.filter(({ label, displayName }) => {
          const string = `${label} ${displayName}`;

          return string.toLowerCase().includes(lowerCaseSearchTerm);
        }),
      })),
    })),
  }));

  filteredData = filteredData.map(({ folders, ...rest }) => ({
    ...rest,
    folders: folders.map(({ pages, ...rest }) => ({
      ...rest,
      pages: pages.filter(({ answers }) => answers.length),
    })),
  }));

  return filteredData;
};

export default searchByAnswerTitleOrShortCode;
