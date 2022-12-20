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
    repeatingSectionListId,
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
          repeatingSectionListId,
          repeatingSectionTitle,
        },
      },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
