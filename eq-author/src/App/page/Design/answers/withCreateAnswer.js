import { graphql } from "react-apollo";

import { DATE_RANGE } from "constants/answer-types";

import createAnswerMutation from "graphql/createAnswer.graphql";

export const mapMutateToProps = ({ mutate }) => ({
  onAddAnswer(pageId, type) {
    const answer = {
      type,
      questionPageId: pageId,
      description: "",
      guidance: "",
      qCode: "",
      label: "",
    };

    if (type === DATE_RANGE) {
      answer.secondaryLabel = "";
    }

    return mutate({
      variables: { input: answer },
    }).then((res) => res.data.createAnswer);
  },
});

export default graphql(createAnswerMutation, {
  props: mapMutateToProps,
});
