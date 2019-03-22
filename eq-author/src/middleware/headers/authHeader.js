const getQuestionnaireId = () => {
  const hash = window.location.hash;
  const matches = /#\/q\/([0-9a-zA-Z-_]+)\/?/.exec(hash);
  if (matches && matches.length > 1) {
    return matches[1];
  }
};

export default headers => {
  if (!window.localStorage) {
    return {
      ...headers,
    };
  }

  const accessToken = localStorage.getItem("accessToken");
  const returnedHeaders = {
    ...headers,
  };

  const questionnaireId = getQuestionnaireId();
  if (questionnaireId) {
    returnedHeaders.questionnaireId = questionnaireId;
  }

  if (accessToken) {
    returnedHeaders.authorization = `Bearer ${accessToken}`;
  }

  return {
    ...returnedHeaders,
  };
};
