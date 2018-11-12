import { graphql } from "react-apollo";

import updateSectionMutation from "graphql/updateSection.graphql";

export const displayToast = (ownProps, section) => {
  const { id, introductionTitle, introductionContent } = section;
  ownProps.raiseToast(
    `Section${id}`,
    "Section introduction deleted",
    "undeleteSectionIntroduction",
    {
      id,
      introductionTitle,
      introductionContent,
      introductionEnabled: true
    }
  );
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteSectionIntro(section) {
    const mutation = mutate({
      variables: {
        input: {
          id: section.id,
          introductionTitle: null,
          introductionContent: null,
          introductionEnabled: false
        }
      }
    });

    return mutation
      .then(() => displayToast(ownProps, section))
      .then(() => mutation);
  }
});

export default graphql(updateSectionMutation, {
  props: mapMutateToProps
});
