import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";

import CommentsPanel from "App/Comments";

import { Field } from "components/Forms";
import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import Title from "components/preview/elements/PageTitle";
import Error from "components/preview/Error";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

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

const OptionItem = styled.div`
  font-size: 1em;
  background: #fff;
  border: 2px solid ${colors.lightGrey};
  border-radius: 0.2em;
  width: fit-content;
  min-width: 20em;
  width: 100%;
  display: block;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5em;

  padding-left: 1em;
  word-wrap: break-word;
`;

const Input = styled.input`
  width: 20px;
  height: 20px;
  appearance: none;
  border: 1px solid #9b9b9b;
  padding: 0.5em;
  background: #eee;
  box-shadow: inset 0 0 0 3px white;
  pointer-events: none;
  position: absolute;
  top: 1em;

  border-radius: 100px;
  box-shadow: inset 0 0 0 3px #fff;
`;

const OptionContentWrapper = styled.div`
  padding: 0.7em 1em 0.7em 2.5em;
`;

const OptionLabel = styled.label`
  display: block;
  font-size: 1em;
  color: inherit;
  line-height: 1.4;
  font-weight: 600;
  margin: 0;
`;

const OptionDescription = styled.div`
  font-size: 0.8em;
  margin-top: 0.2em;
  color: ${colors.text};
  width: 100%;
`;

const QualifierPagePreview = ({ page }) => {
  const {
    id,
    title,
    displayName,
    answers,
    folder,
    section,
    comments,
    validationErrorInfo,
  } = page;

  useSetNavigationCallbacksForPage({
    page: page,
    folder: folder,
    section: section,
  });

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
          {answers.map((answer) => {
            return answer.options.map((option) =>
              option.label ? (
                <OptionItem key={option.id}>
                  <Input type="radio" />
                  <OptionContentWrapper>
                    <OptionLabel>{option.label}</OptionLabel>
                    {option.description && (
                      <OptionDescription>
                        {option.description}
                      </OptionDescription>
                    )}
                  </OptionContentWrapper>
                </OptionItem>
              ) : (
                <Error>Missing label</Error>
              )
            );
          })}
        </Container>
      </Panel>
    </EditorLayout>
  );
};

export default QualifierPagePreview;
