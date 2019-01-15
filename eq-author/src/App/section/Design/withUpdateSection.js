import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateSection(section) {
    return mutate({
      variables: {
        input: section,
      },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
