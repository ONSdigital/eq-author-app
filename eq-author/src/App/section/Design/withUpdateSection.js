import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateSection({
    id,
    title,
    alias,
    introductionTitle,
    introductionContent,
    repeatingSection,
    repeatingSectionlistId,
    repeatingSectionTitle,
  }) {
    return mutate({
      variables: {
        input: {
          id,
          title,
          alias,
          introductionTitle,
          introductionContent,
          repeatingSection,
          repeatingSectionlistId,
          repeatingSectionTitle,
        },
      },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
