import { graphql } from "react-apollo";

import deleteSectionIntroMutation from "./deleteSectionIntro.graphql";

export const displayToast = (ownProps, sectionIntro) => {
  const { id, introductionTitle, introductionContent } = sectionIntro;
  ownProps.raiseToast(
    `Section${id}`,
    "Section introduction deleted",
    "undeleteSectionIntroduction",
    {
      id,
      introductionTitle,
      introductionContent,
    }
  );
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
