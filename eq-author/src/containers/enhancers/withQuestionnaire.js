import getQuestionnaireQuery from "graphql/getQuestionnaire.graphql";
import { graphql } from "react-apollo";
import { get } from "lodash/fp";

export const mapResultsToProps = get("data");

export const mapPropToOptions = props => ({
  variables: { id: props.match.params.questionnaireId }
});

export default graphql(getQuestionnaireQuery, {
  props: mapResultsToProps,
  options: mapPropToOptions
});
