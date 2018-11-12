import updateAnswerMutation from "graphql/updateAnswer.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateAnswer: answer =>
    mutate({
      variables: { input: answer }
    })
});

export default graphql(updateAnswerMutation, {
  props: mapMutateToProps
});
