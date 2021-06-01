import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

const mutation = gql`
  mutation UpdateQuestionnaireIntroduction(
    $input: UpdateQuestionnaireIntroductionInput!
  ) {
    updateQuestionnaireIntroduction(input: $input) {
      id
      title
      additionalGuidancePanelSwitch
      additionalGuidancePanel
      description
      secondaryTitle
      secondaryDescription
      tertiaryTitle
      tertiaryDescription
    }
  }
`;
const inputFilter = gql`
  {
    id
    title
    additionalGuidancePanelSwitch
    additionalGuidancePanel
    description
    secondaryTitle
    secondaryDescription
    tertiaryTitle
    tertiaryDescription
  }
`;

export const mapMutateToProps = ({ mutate }) => ({
  updateQuestionnaireIntroduction: (introduction) => {
    const data = filter(inputFilter, introduction);
    return mutate({
      variables: { input: data },
      optimisticResponse: {
        updateQuestionnaireIntroduction: {
          ...introduction,
          ...data,
          __typename: "QuestionnaireIntroduction",
        },
      },
    });
  },
});

export default graphql(mutation, {
  props: mapMutateToProps,
});
