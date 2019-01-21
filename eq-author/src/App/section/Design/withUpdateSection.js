import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateSection({ id, title, alias }) {
    return mutate({
      variables: { input: { id, title, alias } },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
