import gql from "graphql-tag";
import { PAGES, ANSWERS } from "../../constants/validation-error-types";

export const typeDefs = gql`
  extend type QuestionPage {
    isNew: Boolean!
  }

  extend type BasicAnswer {
    isNew: Boolean!
  }
`;

const GET_NEW_ENTITY_LIST = gql`
  query newEntityList {
    newEntityList @client
  }
`;

const addNewEntity = (type, id, cache) => {
  const { newEntityList } = cache.readQuery({
    query: GET_NEW_ENTITY_LIST,
  });
  newEntityList.push(`${type}_${id}`);
  cache.writeData({ data: { newEntityList } });
};

const removeNewEntity = (type, id, cache) => {
  const { newEntityList } = cache.readQuery({
    query: GET_NEW_ENTITY_LIST,
  });

  const updatedPageList = newEntityList.filter(p => p !== `${type}_${id}`);
  cache.writeData({ data: { newEntityList: updatedPageList } });
};

const initialiseMultiplePages = (pages, cache) => {
  pages.forEach(questionPage => {
    addNewEntity(PAGES, questionPage.id, cache);
  });
};

const isNewEntity = type => (entity, args, { cache }) => {
  const { newEntityList } = cache.readQuery({
    query: GET_NEW_ENTITY_LIST,
  });

  return newEntityList.indexOf(`${type}_${entity.id}`) > -1;
};

export const resolvers = {
  QuestionPage: {
    isNew: isNewEntity(PAGES),
  },

  BasicAnswer: {
    isNew: isNewEntity(ANSWERS),
  },

  Mutation: {
    createQuestionnaire: (root, input, { cache }) => {
      cache.writeData({ data: { newEntityList: [] } });
      root.createQuestionnaire.sections.forEach(section => {
        initialiseMultiplePages(section.pages, cache);
      });
    },

    createQuestionPage: (root, input, { cache }) => {
      addNewEntity(PAGES, root.createQuestionPage.id, cache);
    },

    updateQuestionPage: (root, input, { cache }) => {
      removeNewEntity(PAGES, root.updateQuestionPage.id, cache);
    },

    createSection: (root, input, { cache }) => {
      initialiseMultiplePages(root.createSection.pages, cache);
    },

    createAnswer: (root, input, { cache }) => {
      addNewEntity(ANSWERS, root.createAnswer.id, cache);
    },

    updateAnswer: (root, input, { cache }) => {
      removeNewEntity(ANSWERS, root.updateAnswer.id, cache);
    },
  },
};
