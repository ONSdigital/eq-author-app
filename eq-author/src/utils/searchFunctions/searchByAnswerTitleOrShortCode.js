const searchByAnswerTitleOrShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  let filteredData = data.map(({ folders, ...rest }) => ({
    ...rest,
    folders: folders.map(({ pages, ...rest }) => ({
      ...rest,
      pages: pages.map(({ answers, ...rest }) => ({
        ...rest,
        answers: answers.filter(({ title, displayName, alias }) => {
          const string = `${title} ${displayName} ${alias}`;

          return string.includes(searchTerm);
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
