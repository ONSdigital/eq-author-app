import getQuestionnaireList from "graphql/getQuestionnaireList.graphql";
import { graphql } from "react-apollo";

export const mapResultsToProps = ({ data }) => {
  const { loading, questionnaires } = data;

  return {
    loading,
    questionnaires
  };
};

export default graphql(getQuestionnaireList, {
  props: mapResultsToProps
});
