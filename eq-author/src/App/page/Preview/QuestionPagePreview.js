/* eslint-disable react/no-danger */
import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";

import IconText from "components/IconText";
import Error from "components/preview/Error";
import { Answer } from "components/preview/Answers";
import PageTitle from "components/preview/elements/PageTitle";
import EditorLayout from "components/EditorLayout";

import { colors } from "constants/theme";

import QuestionPageEditor from "../Design/QuestionPageEditor";
import CommentsPanel from "App/Comments";

import IconInfo from "./icon-info.svg?inline";
import IconChevron from "./icon-chevron.svg";
import Panel from "components/Panel";

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
    background-color: #dce5b0;
    padding: 0 0.125em;
    font-style: normal;
  }
  span[data-piped] {
    background-color: #e0e0e0;
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre;
  }
`;

export const Description = styled.div`
  margin-bottom: 1em;
  word-wrap: break-word;
`;

const Guidance = styled.div`
  margin-bottom: 2em;
  word-wrap: break-word;
`;

const Box = styled.div`
  border-left: 10px solid #033e58;
  background: #eff0f9;
  padding: 1em;
`;

const Answers = styled.div`
  margin-bottom: 1em;
`;

const Details = styled.div`
  margin-bottom: 1em;
`;

export const DetailsTitle = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.primary};
  margin-bottom: 0.5em;
  word-wrap: break-word;

  &::before {
    width: 32px;
    height: 32px;
    display: inline-block;
    margin-left: -10px;
    content: url(${IconChevron});
    transform: rotate(90deg);
  }
`;

export const DetailsContent = styled.div`
  border-left: 2px solid #999;
  margin-left: 6px;
  padding: 0.2em 0 0.2em 1em;
  word-wrap: break-word;
`;

const QuestionPagePreview = ({ page }) => {
  const {
    title,
    description,
    descriptionEnabled,
    guidance,
    guidanceEnabled,
    definitionLabel,
    definitionContent,
    definitionEnabled,
    additionalInfoLabel,
    additionalInfoContent,
    additionalInfoEnabled,
    answers,
    comments,
  } = page;

  return (
    <EditorLayout
      preview
      logic
      title={page.displayName}
      validationErrorInfo={page.validationErrorInfo}
      renderPanel={() => (
        <CommentsPanel comments={page.comments} componentId={page.id} />
      )}
      comments={comments}
    >
      <Panel>
        <Container>
          <PageTitle title={title} />

          {descriptionEnabled && (
            <div data-test="description">
              {description ? (
                <Description
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <Error large>Missing description</Error>
              )}
            </div>
          )}

          {definitionEnabled && (
            <Details data-test="definition">
              <DetailsTitle>
                {definitionLabel || (
                  <Error small>Missing definition label</Error>
                )}
              </DetailsTitle>
              <DetailsContent>
                {definitionContent ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: definitionContent }}
                  />
                ) : (
                  <Error large margin={false}>
                    Missing definition content
                  </Error>
                )}
              </DetailsContent>
            </Details>
          )}

          {guidanceEnabled && (
            <div data-test="guidance">
              {guidance ? (
                <Guidance>
                  <Box dangerouslySetInnerHTML={{ __html: guidance }} />
                </Guidance>
              ) : (
                <Error large>Missing guidance</Error>
              )}
            </div>
          )}

          {answers.length ? (
            <Answers>
              {answers.map((answer) => (
                <Answer key={answer.id} answer={answer} />
              ))}
            </Answers>
          ) : (
            <Error data-test="no-answers" large>
              <IconText icon={IconInfo}>
                No answers have been added to this question.
              </IconText>
            </Error>
          )}

          {additionalInfoEnabled && (
            <Details data-test="additional-info">
              <DetailsTitle>
                {additionalInfoLabel || (
                  <Error small>Missing additional information label</Error>
                )}
              </DetailsTitle>
              <DetailsContent>
                {additionalInfoContent ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: additionalInfoContent }}
                  />
                ) : (
                  <Error large margin={false}>
                    Missing additional information content
                  </Error>
                )}
              </DetailsContent>
            </Details>
          )}
        </Container>
      </Panel>
    </EditorLayout>
  );
};

QuestionPagePreview.propTypes = {
  page: propType(QuestionPageEditor.fragments.QuestionPage),
};

export default QuestionPagePreview;
