import { graphql } from "react-apollo";
import createOtherMutation from "graphql/createOther.graphql";
import fragment from "graphql/answerFragment.graphql";
import optionFragment from "graphql/fragments/option.graphql";

export const createUpdater = answerId => (proxy, result) => {
  const parentAnswerId = `MultipleChoiceAnswer${answerId}`;
  const other = result.data.createOther;
  const otherAnswerId = `BasicAnswer${other.answer.id}`;
  const otherOptionId = `Option${other.option.id}`;

  const parentAnswer = proxy.readFragment({
    id: parentAnswerId,
    fragment
  });

  parentAnswer.other = other;

  proxy.writeFragment({
    id: otherAnswerId,
    fragment,
    data: other.answer
  });

  proxy.writeFragment({
    id: otherOptionId,
    fragment: optionFragment,
    data: other.option
  });

  proxy.writeFragment({
    id: parentAnswerId,
    fragment,
    data: parentAnswer
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddOther({ id }) {
    const input = {
      parentAnswerId: id
    };

    const update = createUpdater(id);

    return mutate({
      variables: { input },
      update
    }).then(res => res.data.createOther);
  }
});

export default graphql(createOtherMutation, {
  props: mapMutateToProps
});
