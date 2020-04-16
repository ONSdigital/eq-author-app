import gql from "graphql-tag";
import { graphql } from "react-apollo";

const TOGGLE_PUBLIC_MUTATION = gql`
  mutation TogglePublic($input: UpdateQuestionnaireInput!) {
    updateQuestionnaire(input: $input) {
      id
      isPublic
    }
  }
`;

export const mapMutateToProps = ({ mutate, ownProps: { questionnaire } }) => ({
  togglePublic: () =>
    mutate({
      variables: {
        input: { id: questionnaire.id, isPublic: !questionnaire.isPublic },
      },
    }),
});

export default graphql(TOGGLE_PUBLIC_MUTATION, {
  props: mapMutateToProps,
});
