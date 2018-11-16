import { graphql } from "react-apollo";
import createAnswerMutation from "graphql/createAnswer.graphql";
import fragment from "graphql/pageFragment.graphql";
import { TIME, MEASUREMENT, NUMBER } from "constants/answer-types";

export const createUpdater = pageId => (proxy, result) => {
  const id = `QuestionPage${pageId}`;
  const page = proxy.readFragment({
    id,
    fragment
  });

  page.answers.push(result.data.createAnswer);

  proxy.writeFragment({
    id,
    fragment,
    data: page
  });
};

export const mapMutateToProps = ({ mutate }) => ({
  onAddAnswer(pageId, type) {
    if (type === TIME || type === MEASUREMENT) {
      type = NUMBER;
    }

    const answer = {
      type,
      questionPageId: pageId,
      description: "",
      guidance: "",
      qCode: "",
      label: ""
    };

    const update = createUpdater(pageId);

    return mutate({
      variables: { input: answer },
      update
    }).then(res => res.data.createAnswer);
  }
});

export default graphql(createAnswerMutation, {
  props: mapMutateToProps
});
