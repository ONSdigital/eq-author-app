import { graphql } from "react-apollo";

import createSectionMutation from "./createSectionIntro.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  createSectionIntro(id) {
    return mutate({
      variables: {
        input: {
          sectionId: id,
          introductionTitle: null,
          introductionContent: null,
        },
      },
    });
  },
});

export default graphql(createSectionMutation, {
  props: mapMutateToProps,
});
