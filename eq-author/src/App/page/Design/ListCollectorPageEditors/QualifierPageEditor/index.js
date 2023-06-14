import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import gql from "graphql-tag";

const QualifierPageEditor = () => {
  return <p>Qualifier page</p>;
};

QualifierPageEditor.fragments = {
  ListCollectorQualifierPage: gql`
    fragment ListCollectorQualifierPage on ListCollectorQualifierPage {
      id
      alias
      title
      pageType
      position
      answers {
        ...AnswerEditor
      }
      folder {
        id
        position
      }
      section {
        id
        position
        repeatingSection
        allowRepeatingSection
        repeatingSectionListId
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
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
  `,
};

export default QualifierPageEditor;
