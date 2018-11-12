import { graphql } from "react-apollo";
import createExclusiveOptionMutation from "graphql/createMutuallyExclusiveOption.graphql";
import fragment from "graphql/answerFragment.graphql";

export const createUpdater = answerId => (proxy, result) => {
  const id = `MultipleChoiceAnswer${answerId}`;
  const answer = proxy.readFragment({ id, fragment });

  answer.mutuallyExclusiveOption = result.data.createMutuallyExclusiveOption;

  proxy.writeFragment({
    id,
    fragment,
    data: answer
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddExclusive(answerId) {
    const option = { answerId };

    const update = createUpdater(answerId);

    return mutate({
      variables: { input: option },
      update
    }).then(res => res.data.createMutuallyExclusiveOption);
  }
});

export default graphql(createExclusiveOptionMutation, {
  props: mapMutateToProps
});
