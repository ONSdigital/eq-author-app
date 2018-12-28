import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateSection(section) {
    const mutation = mutate({
      variables: { input: section }
    });

    return mutation.then(() => mutation);
  }
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps
});
