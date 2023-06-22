import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import CommentsPanel from "App/Comments";

import { Field } from "components/Forms";
import EditorLayout from "components/EditorLayout";

const StyledField = styled(Field)`
  padding: 0 2em;
`;

const Title = styled.h4`
  margin-bottom: -0.5em;
`;

const QualifierPagePreview = ({ page }) => {
  const { id, displayName, comments, validationErrorInfo } = page;

  return (
    <EditorLayout
      preview
      title={displayName}
      validationErrorInfo={validationErrorInfo}
      comments={comments}
      renderPanel={() => <CommentsPanel comments={comments} componentId={id} />}
    >
      <StyledField>
        <p>Lorem ipsum</p>
      </StyledField>
    </EditorLayout>
  );
};

export default QualifierPagePreview;
