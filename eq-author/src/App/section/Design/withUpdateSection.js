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
        },
      },
    });
  },
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps,
});
