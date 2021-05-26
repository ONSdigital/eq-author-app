import React from "react";
import styled from "styled-components";
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
  margin: 0.5em;
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
      />
      <StyledLabel htmlFor={`${thisTheme}-preview-theme`}>
        Preview theme
      </StyledLabel>
    </Container>
  );
};

export default PreviewTheme;
