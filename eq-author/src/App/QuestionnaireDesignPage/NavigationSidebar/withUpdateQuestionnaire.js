import updateQuestionnaire from "graphql/updateQuestionnaire.graphql";
import { graphql } from "react-apollo";

export const mapMutateToProps = ({ mutate }) => ({
  onUpdateQuestionnaire: questionnaire =>
    mutate({
      variables: { input: questionnaire }
    })
});

export default graphql(updateQuestionnaire, {
  props: mapMutateToProps
});
