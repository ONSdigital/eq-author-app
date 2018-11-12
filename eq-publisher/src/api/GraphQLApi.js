const { getQuestionnaire } = require("./queries");

class GraphQLApi {
  constructor(apolloFetch) {
    this.apolloFetch = apolloFetch;
  }

  getAuthorData(questionnaireId) {
    return this.apolloFetch({
      query: getQuestionnaire,
      variables: { questionnaireId: questionnaireId.toString() }
    });
  }
}

module.exports = GraphQLApi;
