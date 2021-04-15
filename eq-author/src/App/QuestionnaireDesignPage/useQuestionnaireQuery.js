import { useQuery } from "@apollo/react-hooks";
import QUESTIONNAIRE_QUERY from "./getQuestionnaireQuery.graphql";

export default (questionnaireId) =>
  useQuery(QUESTIONNAIRE_QUERY, {
    variables: {
      input: {
        questionnaireId,
      },
    },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
