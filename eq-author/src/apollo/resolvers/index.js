import gql from "graphql-tag";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }
`;

const GET_NEW_PAGES_LIST = gql`
  query newPagesList {
    newPagesList @client
  }
`;

const initialiseMultiplePages = (pages, cache) => {
  const { newPagesList } = cache.readQuery({
    query: GET_NEW_PAGES_LIST,
  });

  pages.forEach(questionPage => {
    newPagesList.push(questionPage.id);
  });

  cache.writeData({ data: { newPagesList } });
};

const isNewQuestionPage = (questionPage, args, { cache }) => {
  const { newPagesList } = cache.readQuery({
    query: GET_NEW_PAGES_LIST,
  });

  return newPagesList.indexOf(questionPage.id) > -1;
};

export const resolvers = {
  QuestionPage: {
    isNew: isNewQuestionPage,
  },

  Mutation: {
    createQuestionnaire: (root, input, { cache }) => {
      cache.writeData({ data: { newPagesList: [] } });
      root.createQuestionnaire.sections.forEach(section => {
        initialiseMultiplePages(section.pages, cache);
      });
    },

    createQuestionPage: (root, input, { cache }) => {
      const { newPagesList } = cache.readQuery({
        query: GET_NEW_PAGES_LIST,
      });
      newPagesList.push(root.createQuestionPage.id);

      cache.writeData({ data: { newPagesList } });
    },

    updateQuestionPage: (root, input, { cache }) => {
      const { newPagesList } = cache.readQuery({
        query: GET_NEW_PAGES_LIST,
      });

      const updatedPageList = newPagesList.filter(
        p => p !== root.updateQuestionPage.id
      );

      cache.writeData({ data: { newPagesList: updatedPageList } });
    },

    createSection: (root, input, { cache }) => {
      initialiseMultiplePages(root.createSection.pages, cache);
    },
  },
};
