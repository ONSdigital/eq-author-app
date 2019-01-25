import { graphql } from "react-apollo";

import deleteSectionIntroMutation from "./deleteSectionIntro.graphql";

export const displayToast = (ownProps, section) => {
  const { id, introductionTitle, introductionContent } = section;
  ownProps.raiseToast(`Section${id}`, "Section introduction deleted", {
    id,
    introductionTitle,
    introductionContent,
    introductionEnabled: true,
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  deleteSectionIntro(sectionIntro) {
    const mutation = mutate({
      variables: {
        input: {
          sectionId: sectionIntro.id,
        },
      },
    });

    return mutation
      .then(() => displayToast(ownProps, sectionIntro))
      .then(() => mutation);
  },
});

export default graphql(deleteSectionIntroMutation, {
  props: mapMutateToProps,
});
