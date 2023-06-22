import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import CommentsPanel from "App/Comments";

import { Field } from "components/Forms";
import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import Title from "components/preview/elements/PageTitle";

const Container = styled.div`
  padding: 2em;
  font-size: 1.1em;
  p {
    margin: 0 0 1em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  em {
    background-color: ${colors.highlightGreen};
    padding: 0 0.125em;
    font-style: normal;
  }
  span[data-piped] {
    background-color: ${colors.pipingGrey};
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre-wrap;
  }
`;

const QualifierPagePreview = ({ page }) => {
  const { id, title, displayName, comments, validationErrorInfo } = page;

  return (
    <EditorLayout
      preview
      title={displayName}
      validationErrorInfo={validationErrorInfo}
      comments={comments}
      renderPanel={() => <CommentsPanel comments={comments} componentId={id} />}
    >
      <Panel>
        <Container>
          <Title title={title} />
        </Container>
      </Panel>
    </EditorLayout>
  );
};

export default QualifierPagePreview;
