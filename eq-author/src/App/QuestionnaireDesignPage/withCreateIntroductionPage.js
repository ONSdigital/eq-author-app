import { graphql } from "react-apollo";
import { get } from "lodash/fp";

import createIntroductionPageMutation from "graphql/createIntroductionPage.graphql";

import { buildIntroductionPath } from "utils/UrlUtils";

export const redirectToNewPage =
  ({ history, match: { params } }) =>
  (introduction) => {
    const { id } = introduction;
    history.push(
      buildIntroductionPath({
        questionnaireId: params.questionnaireId,
        introductionId: id,
        tab: "design",
      })
    );
  };

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onAddIntroductionPage() {
    return mutate()
      .then(get("data.createIntroductionPage"))
      .then(redirectToNewPage(ownProps));
  },
});

export default graphql(createIntroductionPageMutation, {
  props: mapMutateToProps,
});
