import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useMutation } from "@apollo/react-hooks";

import UPDATE_PREVIEW_THEME from "../graphql/updatePreviewTheme.graphql";

import { Input, Label } from "components/Forms";

const Container = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1em;
`;

const StyledLabel = styled(Label)`
  margin: 0 0.5em;
`;

const StyledInput = styled(Input)`
  position: unset;
  margin: 0;
`;

const PreviewTheme = ({ questionnaireId, thisTheme, previewTheme }) => {
  const [updatePreviewTheme] = useMutation(UPDATE_PREVIEW_THEME);

  return (
    <Container>
      <StyledInput
        id={`${thisTheme}-preview-theme`}
        type={"radio"}
        variant="radioBox"
        onChange={() =>
          updatePreviewTheme({
            variables: { input: { questionnaireId, previewTheme: thisTheme } },
          })
        }
        checked={thisTheme === previewTheme}
        dataTest={`${thisTheme}-preview-theme-button`}
      />
      <StyledLabel
        htmlFor={`${thisTheme}-preview-theme`}
        dataTest={`${thisTheme}-preview-theme-label`}
      >
        Preview theme
      </StyledLabel>
    </Container>
  );
};

PreviewTheme.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  thisTheme: PropTypes.string.isRequired,
  previewTheme: PropTypes.string,
};

export default PreviewTheme;
