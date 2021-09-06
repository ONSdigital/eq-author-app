import searchByAnswerTitleOrShortCode from "./searchByAnswerTitleShortCode";
import searchByQuestionTitleOrShortCode from "./searchByQuestionTitleShortCode";
import { getPageById, removePageById } from "utils/questionnaireUtils";
import { getFolderById } from "../questionnaireUtils";

const searchByAnswerAndQuestionTitleShortCode = (data, searchTerm) => {
  let questionSearchResults = searchByQuestionTitleOrShortCode(
    data,
    searchTerm
  );

  const answerSearchResults = searchByAnswerTitleOrShortCode(data, searchTerm);

  let searchResults = [];

  searchResults = answerSearchResults.map((section) => {
    const { folders, ...rest } = section;

    const foldersNew = folders.map((folder) => {
      const { id, pages, ...rest } = folder;

      const pagesA = pages.map((page) => {
        const { id } = page;

        const pageFromPageResults = getPageById(
          { sections: questionSearchResults },
          id
        );

        if (pageFromPageResults) {
          // Remove the page we're about to merge
          questionSearchResults = removePageById(
            {
              sections: questionSearchResults,
            },
            id
          ).sections;

          return pageFromPageResults;
        }

        return page;
      });

      const pagesB = getFolderById(
        { sections: questionSearchResults },
        id
      ).pages;

      // Merge the pages that weren't found in our first pass over
      return { id, pages: [...pagesA, ...pagesB], ...rest };
    });

    return { folders: foldersNew, ...rest };
  });

  return searchResults;
};

export default searchByAnswerAndQuestionTitleShortCode;
