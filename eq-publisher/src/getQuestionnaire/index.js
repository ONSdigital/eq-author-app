const { createApolloFetch: caf } = require("apollo-fetch");
const { getQuestionnaire } = require("./queries");

module.exports = (uri, createApolloFetch = caf) => (questionnaireId, token) => {
  const apolloFetch = createApolloFetch({
    uri,
  });
  apolloFetch.use(({ options }, next) => {
    const headers = options.headers || {};

    headers.authorization = `Bearer ${token}`;
    headers.questionnaireId = questionnaireId;

    options.headers = headers;
    return next();
  });

  return apolloFetch({
    query: getQuestionnaire,
    variables: { input: { questionnaireId: questionnaireId.toString() } },
  });
};
