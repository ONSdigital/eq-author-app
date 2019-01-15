import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ ownProps, mutate }) => {
  return {
    onUpdateSection({ id, title, alias }) {
      return mutate({
        variables: {
          input: {
            questionnaireId: ownProps.match.params.questionnaireId,
            id,
            title,
            alias,
          },
        },
      });
    },
  };
};

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
