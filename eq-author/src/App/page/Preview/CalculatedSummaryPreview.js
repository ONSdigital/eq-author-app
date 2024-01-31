/* eslint-disable react/no-danger */
import React from "react";
import { propType } from "graphql-anywhere";

import styled from "styled-components";
import Error from "components/preview/Error";
import PageTitle from "components/preview/elements/PageTitle";
import Info from "components/preview/elements/Info";

import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import { Grid, Column } from "components/Grid";
import CommentsPanel from "App/Comments";

import { colors } from "constants/theme";
import CalculatedSummaryPageEditor from "../Design/CalculatedSummaryPageEditor";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

const Button = styled.div`
  color: white;
  background-color: ${colors.positive};
  border: 2px solid ${colors.positive};
  padding: 0.75rem 1rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 3px;
  display: inline-block;
  text-rendering: optimizeLegibility;
  margin-bottom: 2em;
`;

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
    white-space: pre-wrap;
  }
`;

const Summary = styled.div`
  border-bottom: 1px solid #999;
  margin-bottom: 2rem;
`;

const SummaryItem = styled.div`
  border-top: 1px solid #999;
  border-radius: 0;
  position: relative;
  padding: 1rem 0;
`;

const SummaryLabel = styled.div`
  font-weight: normal;
  word-break: break-word;
`;

const SummaryValue = styled.div`
  background: #e0e0e0;
  color: ${colors.textLight};
  line-height: 1;
  padding: 0.2em 0.5em;
  text-align: center;
  font-size: 0.8em;
  font-weight: bold;
  display: inline;
  border-radius: 4px;
`;

const SummaryLink = styled.div`
  color: ${colors.primary};
  text-align: right;
  text-decoration: underline;
`;

const SummaryTotal = styled(SummaryItem)`
  font-size: 1.2em;
`;

const SummaryTotalLabel = styled.div`
  font-weight: bold;
  word-break: break-word;
`;

const CalculatedSummaryPagePreview = ({ page }) => {
  useSetNavigationCallbacksForPage({
    page: page,
    folder: page?.folder,
    section: page?.section,
  });

  return (
    <EditorLayout
      title={page.displayName}
      preview
      logic
      validationErrorInfo={page.validationErrorInfo}
      renderPanel={() => (
        <CommentsPanel comments={page.comments} componentId={page.id} />
      )}
      comments={page.comments}
    >
      <Panel data-test="calSum test page">
        <Container>
          <PageTitle title={page.title} />
          {page.summaryAnswers.length > 0 ? (
            <Summary>
              {page.summaryAnswers.map((answer) => (
                <SummaryItem key={answer.id}>
                  <Grid>
                    <Column cols={7}>
                      <SummaryLabel data-test="answer-item">
                        {answer.displayName}
                      </SummaryLabel>
                    </Column>
                    <Column cols={3}>
                      <SummaryValue>Value</SummaryValue>
                    </Column>
                    <Column cols={2}>
                      <SummaryLink>Change</SummaryLink>
                    </Column>
                  </Grid>
                </SummaryItem>
              ))}

              {page.totalTitle ? (
                <SummaryTotal>
                  <Grid>
                    <Column cols={7}>
                      <SummaryTotalLabel
                        data-test="total-title"
                        dangerouslySetInnerHTML={{ __html: page.totalTitle }}
                      />
                    </Column>
                    <Column cols={3}>
                      <SummaryValue>Value</SummaryValue>
                    </Column>
                    <Column cols={2} />
                  </Grid>
                </SummaryTotal>
              ) : (
                <Error large data-test="no-total-title">
                  Missing total title
                </Error>
              )}
            </Summary>
          ) : (
            <Error large data-test="no-answers-selected">
              No answers selected
            </Error>
          )}
          <Button>Yes, I confirm this is correct</Button>
        </Container>
      </Panel>
    </EditorLayout>
  );
};

CalculatedSummaryPagePreview.propTypes = {
  page: propType(CalculatedSummaryPageEditor.fragments.CalculatedSummaryPage),
};

export default CalculatedSummaryPagePreview;
