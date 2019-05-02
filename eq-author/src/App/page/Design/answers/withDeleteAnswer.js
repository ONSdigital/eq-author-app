import { graphql } from "react-apollo";
import deleteAnswerMutation from "graphql/deleteAnswer.graphql";

export const displayToast = (ownProps, pageId, answerId) => {
  ownProps.raiseToast(`Answer${answerId}`, "Answer deleted", {
    pageId,
    answerId,
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteAnswer(pageId, answerId) {
    const answer = { id: answerId };

    return mutate({
      variables: { input: answer },
    }).then(() => displayToast(ownProps, pageId, answerId));
  },
});

export default graphql(deleteAnswerMutation, {
  props: mapMutateToProps,
});
