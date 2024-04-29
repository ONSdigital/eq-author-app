/* eslint-disable react/no-danger */
import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme.js";
import { useQuery } from "@apollo/react-hooks";

import CommentsPanel from "App/Comments";

import EditorLayout from "components/EditorLayout";
import Panel from "components/Panel";
import Loading from "components/Loading";
import Error from "components/Error";
import IconText from "components/IconText";

import Title from "components/preview/elements/PageTitle";
import { Answer } from "components/preview/Answers";
import EmptyAnswersError from "components/preview/Error";
import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

import IconInfo from "assets/icon-missing-collection-list-answers.svg?inline";
import IconChevron from "../../icon-chevron.svg";

import GET_COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";

const Container = styled.div`
  padding: 2em;
  font-size: 1.1em;
  p {
    margin: 0 0 1em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  span[data-piped] {
    background-color: ${colors.pipingGrey};
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre-wrap;
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

const GuidancePanel = styled.div`
  border-left: 10px solid ${colors.nightBlue};
  background: ${colors.paleBlue};
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
  border-left: 2px solid ${colors.borders};
  margin-left: 6px;
  padding: 0.2em 0 0.2em 1em;
  word-wrap: break-word;
`;

const AddItemPagePreview = ({ page }) => {
  const {
    id,
    title,
    displayName,
    folder,
    section,
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
    comments,
    validationErrorInfo,
  } = page;

  useSetNavigationCallbacksForPage({
    page,
    folder,
    section,
  });

  const { data, loading, error } = useQuery(GET_COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <EditorLayout>
        <Loading height="100%">Questionnaire lists loading…</Loading>
      </EditorLayout>
    );
  }

  if (error) {
    return (
      <EditorLayout>
        <Error>Something went wrong</Error>
      </EditorLayout>
    );
  }

  let answers = [];
  const { lists } = data?.collectionLists;
  const selectedList = lists.find(({ id }) => id === folder.listId);

  if (selectedList != null) {
    answers = selectedList.answers;
  }

  return (
    <EditorLayout
      preview
      title={displayName}
      validationErrorInfo={validationErrorInfo}
      comments={comments}
      renderPanel={() => <CommentsPanel comments={comments} componentId={id} />}
    >
      <Panel>
        <Container data-test="list-collector-add-item-page-preview">
          <Title title={title} />
          {descriptionEnabled && (
            <div data-test="description">
              {description ? (
                <Description
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <EmptyAnswersError large>Missing description</EmptyAnswersError>
              )}
            </div>
          )}
          {definitionEnabled && (
            <Details data-test="definition">
              <DetailsTitle>
                {definitionLabel || (
                  <EmptyAnswersError small>
                    Missing definition label
                  </EmptyAnswersError>
                )}
              </DetailsTitle>
              <DetailsContent>
                {definitionContent ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: definitionContent }}
                  />
                ) : (
                  <EmptyAnswersError large margin={false}>
                    Missing definition content
                  </EmptyAnswersError>
                )}
              </DetailsContent>
            </Details>
          )}
          {guidanceEnabled && (
            <div data-test="guidance">
              {guidance ? (
                <Guidance>
                  <GuidancePanel
                    dangerouslySetInnerHTML={{ __html: guidance }}
                  />
                </Guidance>
              ) : (
                <EmptyAnswersError large>Missing guidance</EmptyAnswersError>
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
            <EmptyAnswersError
              data-test="empty-collection-list-answers-error"
              large
            >
              <IconText icon={IconInfo}>
                {selectedList == null
                  ? "Collection list is not selected"
                  : "No answers have been added to this collection list"}
              </IconText>
            </EmptyAnswersError>
          )}
          {additionalInfoEnabled && (
            <Details data-test="additional-info">
              <DetailsTitle>
                {additionalInfoLabel || (
                  <EmptyAnswersError small>
                    Missing additional information label
                  </EmptyAnswersError>
                )}
              </DetailsTitle>
              <DetailsContent>
                {additionalInfoContent ? (
                  <span
                    dangerouslySetInnerHTML={{ __html: additionalInfoContent }}
                  />
                ) : (
                  <EmptyAnswersError large margin={false}>
                    Missing additional information content
                  </EmptyAnswersError>
                )}
              </DetailsContent>
            </Details>
          )}
        </Container>
      </Panel>
    </EditorLayout>
  );
};

AddItemPagePreview.propTypes = {
  page: CustomPropTypes.page,
};

export default AddItemPagePreview;
