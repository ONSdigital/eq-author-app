import { graphql } from "react-apollo";

import { DATE_RANGE } from "constants/answer-types";

import createAnswerMutation from "graphql/createAnswer.graphql";
import fragment from "graphql/pageFragment.graphql";

export const createUpdater = pageId => (proxy, result) => {
  const id = `QuestionPage${pageId}`;
  const page = proxy.readFragment({
    id,
    fragment,
  });

  page.answers.push(result.data.createAnswer);

  proxy.writeFragment({
    id,
    fragment,
    data: page,
  });
};

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

    const update = createUpdater(pageId);

    return mutate({
      variables: { input: answer },
      update,
    }).then(res => res.data.createAnswer);
  },
});

export default graphql(createAnswerMutation, {
  props: mapMutateToProps,
});
