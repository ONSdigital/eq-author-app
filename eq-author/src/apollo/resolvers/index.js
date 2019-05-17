import gql from "graphql-tag";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }

  extend type Mutation {
    createQuestionPage: QuestionPage
    updateQuestionPage: QuestionPage
  }
`;

const GET_NEW_PAGES_VISITED_LIST = gql`
  query newPagesVisitedList {
    newPagesList @client
    pagesVisitedList @client {
      id
      firstVisit
    }
  }
`;

const initialiseMultiplePages = (pages, cache) => {
  const { newPagesList } = cache.readQuery({
    query: GET_NEW_PAGES_VISITED_LIST,
  });

  pages.forEach(questionPage => {
    newPagesList.push(questionPage.id);
  });

  cache.writeData({ data: { newPagesList } });

  pages.forEach(questionPage => {
    isNewQuestionPage(questionPage, {}, { cache });
  });
};

const isNewQuestionPage = (questionPage, args, { cache }) => {
  const { newPagesList, pagesVisitedList } = cache.readQuery({
    query: GET_NEW_PAGES_VISITED_LIST,
  });

  const questionPageState = pagesVisitedList.find(
    p => p.id === questionPage.id
  );

  if (!questionPageState) {
    pagesVisitedList.push({
      id: questionPage.id,
      firstVisit: true,
      __typename: "PagesVisitedList",
    });
    cache.writeData({ data: { pagesVisitedList } });
  }

  if (questionPageState && questionPageState.firstVisit) {
    const newPagesVisitedList = pagesVisitedList.map(p => {
      if (!p.firstVisit || p.id !== questionPage.id) {
        return p;
      }

      return {
        ...p,
        firstVisit: false,
      };
    });

    cache.writeData({ data: { pagesVisitedList: newPagesVisitedList } });
  }

  return (
    newPagesList.indexOf(questionPage.id) > -1 &&
    typeof questionPageState !== "undefined" &&
    questionPageState.firstVisit
  );
};

export const resolvers = {
  QuestionPage: {
    isNew: isNewQuestionPage,
  },

  Mutation: {
    createQuestionnaire: (_, input, { cache }) => {
      cache.writeData({ data: { newPagesList: [] } });
      _.createQuestionnaire.sections.forEach(section => {
        initialiseMultiplePages(section.pages, cache);
      });
    },

    createQuestionPage: (_, input, { cache }) => {
      const { newPagesList } = cache.readQuery({
        query: GET_NEW_PAGES_VISITED_LIST,
      });
      newPagesList.push(_.createQuestionPage.id);
      cache.writeData({ data: { newPagesList } });
    },

    updateQuestionPage: (_, input, { cache }) => {
      const { newPagesList } = cache.readQuery({
        query: GET_NEW_PAGES_VISITED_LIST,
      });
      const updatedPageList = newPagesList.filter(
        p => p.id !== _.updateQuestionPage.id
      );
      cache.writeData({ data: { newPagesList: updatedPageList } });
    },

    createSection: (_, input, { cache }) => {
      initialiseMultiplePages(_.createSection.pages, cache);
    },
  },
};
