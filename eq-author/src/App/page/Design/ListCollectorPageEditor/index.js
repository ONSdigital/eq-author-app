import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";

import getIdForObject from "utils/getIdForObject";
import withChangeUpdate from "enhancers/withChangeUpdate";
import withPropRenamed from "enhancers/withPropRenamed";
import withEntityEditor from "components/withEntityEditor";
import focusOnEntity from "utils/focusOnEntity";
import TotalValidationRuleFragment from "graphql/fragments/total-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";

import PageHeader from "../PageHeader";

import withUpdateListCollectorPage from "./withUpdateListCollectorPage";

import TotalValidation from "../Validation/GroupValidations/TotalValidation";

import {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

const propTypes = {
  match: CustomPropTypes.match.isRequired,
  page: CustomPropTypes.page.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  enableValidationMessage: PropTypes.bool,
};
export const UnwrappedListCollectorEditor = (props) => {
  const {
    page,
    page: { id, lists },
    onChange,
    onUpdate,

    enableValidationMessage,

    match,
  } = props;

  useSetNavigationCallbacksForPage({
    page: page,
    folder: page?.folder,
    section: page?.section,
  });

  const totalValidationErrors = page.validationErrorInfo.errors.filter(
    ({ field }) => field === "totalValidation"
  );
  const error = totalValidationErrors?.[0];

  const errorMessages = {
    ERR_NO_VALUE,
    ERR_REFERENCE_MOVED,
    ERR_REFERENCE_DELETED,
  };

  return (
    <div data-test="question-page-editor">
      <PageHeader
        {...props}
        onUpdate={onUpdate}
        onChange={onChange}
        alertText="All edits, properties and routing settings will also be removed."
      />
    </div>
  );
};

UnwrappedListCollectorEditor.propTypes = propTypes;

UnwrappedListCollectorEditor.fragments = {
  ListCollectorPage: gql`
    fragment ListCollectorPage on ListCollectorPage {
      id
      title
      displayName
      pageType
      listId
      position
      anotherTitle
      anotherPositive
      anotherNegative
      addItemTitle
      alias
      folder {
        id
        position
      }
      section {
        id
        position
        questionnaire {
          id
          metadata {
            id
            displayName
            type
            key
          }
        }
      }
      totalValidation {
        ...TotalValidationRule
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${ValidationErrorInfoFragment}
    ${TotalValidationRuleFragment}
  `,
};

export default flowRight(
  withUpdateListCollectorPage,
  withPropRenamed("withUpdateListCollectorPage", "onUpdate"),
  withEntityEditor(
    "page",
    UnwrappedListCollectorEditor.fragments.ListCollectorPage
  ),
  withChangeUpdate
)(UnwrappedListCollectorEditor);
