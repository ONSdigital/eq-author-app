import { graphql } from "react-apollo";
import deleteAnswerMutation from "graphql/deleteAnswer.graphql";
import { remove } from "lodash";
import fragment from "graphql/pageFragment.graphql";

export const deleteUpdater = (pageId, answerId) => proxy => {
  const id = `QuestionPage${pageId}`;
  const page = proxy.readFragment({ id, fragment });

  remove(page.answers, { id: answerId });

  proxy.writeFragment({
    id,
    fragment,
    data: page
  });
};

export const displayToast = (ownProps, pageId, answerId) => {
  ownProps.raiseToast(`Answer${answerId}`, "Answer deleted", "undeleteAnswer", {
    pageId,
    answerId
  });
};

export const mapMutateToProps = ({ ownProps, mutate }) => ({
  onDeleteAnswer(pageId, answerId) {
    const answer = { id: answerId };
    const update = deleteUpdater(pageId, answerId);

    const mutation = mutate({
      variables: { input: answer },
      update
    });

    return mutation
      .then(() => displayToast(ownProps, pageId, answerId))
      .then(() => mutation);
  }
});

export default graphql(deleteAnswerMutation, {
  props: mapMutateToProps
});
