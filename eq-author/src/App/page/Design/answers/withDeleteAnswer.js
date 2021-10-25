import { graphql } from "react-apollo";
import { flowRight } from "lodash";
import deleteAnswerMutation from "graphql/deleteAnswer.graphql";
import { withShowToast } from "components/Toasts";

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteAnswer(pageId, answerId) {
    const answer = { id: answerId };

    return mutate({
      variables: { input: answer },
      refetchQueries: ["GetQuestionnaire"],
    }).then(() => ownProps.showToast("Answer deleted"));
  },
});

export default flowRight(
  withShowToast,
  graphql(deleteAnswerMutation, {
    props: mapMutateToProps,
  })
);
