import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import gql from "graphql-tag";

const AddItemPageEditor = () => {
  return <p>Add item page</p>;
};

AddItemPageEditor.fragments = {
  ListCollectorAddItemPage: gql`
    fragment ListCollectorAddItemPage on ListCollectorAddItemPage {
      id
      alias
      title
      pageType
      position
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

export default AddItemPageEditor;
