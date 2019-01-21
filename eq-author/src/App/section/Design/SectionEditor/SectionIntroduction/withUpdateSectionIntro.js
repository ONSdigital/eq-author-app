import { graphql } from "react-apollo";

import updateSectionMutation from "./updateSectionIntro.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  updateSectionIntro({ id, introductionTitle, introductionContent }) {
    return mutate({
      variables: {
        input: {
          sectionId: id,
          introductionTitle,
          introductionContent,
        },
      },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
