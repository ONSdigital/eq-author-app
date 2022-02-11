import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { filter } from "graphql-anywhere";

import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";

const mutation = gql`
  mutation UpdateQuestionnaireIntroduction(
    $input: UpdateQuestionnaireIntroductionInput!
  ) {
    updateQuestionnaireIntroduction(input: $input) {
      id
      title
      contactDetailsPhoneNumber
      contactDetailsEmailAddress
      contactDetailsEmailSubject
      contactDetailsIncludeRuRef
      additionalGuidancePanelSwitch
      additionalGuidancePanel
      description
      secondaryTitle
      secondaryDescription
      tertiaryTitle
      tertiaryDescription
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  }
  ${ValidationErrorInfoFragment}
`;
const inputFilter = gql`
  {
    id
    title
    contactDetailsPhoneNumber
    contactDetailsEmailAddress
    contactDetailsEmailSubject
    contactDetailsIncludeRuRef
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
