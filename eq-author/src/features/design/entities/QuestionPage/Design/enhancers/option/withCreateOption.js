import { graphql } from "react-apollo";
import createOptionMutation from "graphql/createOption.graphql";
import fragment from "graphql/answerFragment.graphql";

export const createUpdater = answerId => (proxy, result) => {
  const id = `MultipleChoiceAnswer${answerId}`;
  const answer = proxy.readFragment({ id, fragment });

  answer.options.push(result.data.createOption);

  proxy.writeFragment({
    id,
    fragment,
    data: answer
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddOption(answerId) {
    const option = { answerId };

    const update = createUpdater(answerId);

    return mutate({
      variables: { input: option },
      update
    }).then(res => res.data.createOption);
  }
});

export default graphql(createOptionMutation, {
  props: mapMutateToProps
});
