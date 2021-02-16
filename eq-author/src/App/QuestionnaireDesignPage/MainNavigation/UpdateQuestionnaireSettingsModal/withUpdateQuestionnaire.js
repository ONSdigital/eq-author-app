import gql from "graphql-tag";
import { partial } from "lodash";
import { filter } from "graphql-anywhere";
import { graphql } from "react-apollo";

import updateQuestionnaire from "graphql/updateQuestionnaire.graphql";

const inputStructure = gql`
  {
    id
    title
    description
    theme
    navigation
    surveyId
    summary
    shortTitle
  }
`;
const filterToInput = partial(filter, inputStructure);

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionnaire: (questionnaire) =>
    mutate({
      variables: { input: filterToInput(questionnaire) },
    }),
});

export default graphql(updateQuestionnaire, {
  props: mapMutateToProps,
});
