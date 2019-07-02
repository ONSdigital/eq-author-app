import gql from "graphql-tag";
import { partial } from "lodash";
import { filter } from "graphql-anywhere";
import { graphql } from "react-apollo";

export const ADD_REMOVE_EDITOR_MUTATION = gql`
  mutation AddRemoveEditor($input: UpdateQuestionnaireInput!) {
    updateQuestionnaire(input: $input) {
      id
      permission
      editors {
        id
        name
        email
        picture
      }
    }
  }
`;

const inputStructure = gql`
  {
    id
    editors
  }
`;
const filterToInput = partial(filter, inputStructure);

export const mapMutateToProps = ({ mutate, ownProps: { questionnaire } }) => ({
  removeEditor: editorId =>
    mutate({
      variables: {
        input: filterToInput({
          ...questionnaire,
          editors: questionnaire.editors
            .map(e => e.id)
            .filter(eId => eId !== editorId),
        }),
      },
    }),
  addEditor: editorId =>
    mutate({
      variables: {
        input: filterToInput({
          ...questionnaire,
          editors: [...questionnaire.editors.map(e => e.id), editorId],
        }),
      },
    }),
});

export default graphql(ADD_REMOVE_EDITOR_MUTATION, {
  props: mapMutateToProps,
});
