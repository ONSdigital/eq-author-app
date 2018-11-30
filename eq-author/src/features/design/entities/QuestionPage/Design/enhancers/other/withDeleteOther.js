import { graphql } from "react-apollo";
import deleteOtherMutation from "graphql/deleteOther.graphql";
import fragment from "graphql/answerFragment.graphql";

export const deleteUpdater = answerId => proxy => {
  const id = `MultipleChoiceAnswer${answerId}`;
  const parentAnswer = proxy.readFragment({ id, fragment });

  parentAnswer.other = null;

  proxy.writeFragment({
    id,
    fragment,
    data: parentAnswer
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onDeleteOther({ id }) {
    const answer = { parentAnswerId: id };

    const update = deleteUpdater(id);

    return mutate({
      variables: { input: answer },
      update
    });
  }
});

export default graphql(deleteOtherMutation, {
  props: mapMutateToProps
});
