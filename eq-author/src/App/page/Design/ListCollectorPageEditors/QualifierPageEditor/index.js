import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import PageHeader from "../../PageHeader";

import gql from "graphql-tag";

const Title = styled.h4`
  margin-bottom: ${(props) => props.marginBottom}em;
`;

const ContentContainer = styled.div`
  width: ${(props) => props.width}%;
`;

const Content = styled.p``;

const QualifierPageEditor = ({ page }) => {
  return <PageHeader page={page} />;
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
