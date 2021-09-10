import searchByAnswerTitleOrShortCode from "./searchByAnswerTitle";
import searchByQuestionTitleOrShortCode from "./searchByQuestionTitleShortCode";
import {
  getFolderById,
  getPageById,
  removePageById,
} from "utils/questionnaireUtils";

const searchByAnswerAndQuestionTitleShortCode = (data, searchTerm) => {
  if (!searchTerm || searchTerm === "") {
    return data;
  }

  let questionSearchResults = searchByQuestionTitleOrShortCode(
    data,
    searchTerm
  );

  const answerSearchResults = searchByAnswerTitleOrShortCode(data, searchTerm);

  let searchResults = [];

  searchResults = answerSearchResults.map((section) => {
    const { folders, ...rest } = section;

    const foldersNew = folders.map((folder) => {
      const { id: folderId, pages, ...rest } = folder;

      const pagesA = pages.map((page) => {
        const { id: pageId } = page;

        const pageFromPageResults = getPageById(
          { sections: questionSearchResults },
          pageId
        );

        if (pageFromPageResults) {
          // Remove the page we're about to merge
          questionSearchResults = removePageById(
            {
              sections: questionSearchResults,
            },
            pageId
          ).sections;

          return pageFromPageResults;
        }

        return page;
      });

      const pagesB =
        getFolderById({ sections: questionSearchResults }, folderId)?.pages ||
        [];

      // Merge the pages that weren't merged in our first pass over
      return { id: folderId, pages: [...pagesA, ...pagesB], ...rest };
    });

    return { folders: foldersNew, ...rest };
  });

  return searchResults;
};

export default searchByAnswerAndQuestionTitleShortCode;
