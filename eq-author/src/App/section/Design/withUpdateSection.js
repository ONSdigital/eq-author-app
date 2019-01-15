import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ ownProps, mutate }) => {
  console.log(ownProps);

  return {
    onUpdateSection(section) {
      return mutate({
        variables: {
          input: {
            questionnaireId: ownProps.match.params.questionnaireId,
            ...section,
          },
        },
      });
    },
  };
};

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
