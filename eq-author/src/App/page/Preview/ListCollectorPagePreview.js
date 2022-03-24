/* eslint-disable react/no-danger */
import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Loading from "components/Loading";
import IconText from "components/IconText";
import Error from "components/preview/Error";
import { Answer } from "components/preview/Answers";
import PageTitle from "components/preview/elements/PageTitle";
import EditorLayout from "components/EditorLayout";

import { colors } from "constants/theme";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import ListCollectorPageEditor from "../Design/ListCollectorPageEditor";
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

const OptionLabel = styled.label`
  display: block;
  font-size: 1em;
  color: inherit;
  line-height: 1.4;
  font-weight: bold;
  padding: 0.7em 1em 0.7em 2.5em;
  margin: 0;
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
const OptionDescription = styled.div`
  font-size: 0.8em;
  margin-top: 0.5em;
  color: ${colors.text};
`;

const OptionItem = styled.div`
  font-size: 1em;
  background: #fff;
  border: 2px solid ${colors.lightGrey};
  border-radius: 0.2em;
  width: fit-content;
  min-width: 20em;
  max-width: 100%;
  display: block;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.25em;

  padding-left: 1em;
  word-wrap: break-word;
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

const ListCollectorPagePreview = ({ page }) => {
  const {
    title,
    listId,
    anotherTitle,
    anotherPositive,
    anotherNegative,
    anotherPositiveDescription,
    anotherNegativeDescription,
    addItemTitle,
    // alias,
  } = page;

  const { data } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });
  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }
  let selectedList = [];
  selectedList = lists.find(({ id }) => id === page.listId);

  let answers = [];

  answers = selectedList.answers;

  console.log(answers);
  return (
    <EditorLayout
      preview
      logic
      title={page.displayName}
      validationErrorInfo={page.validationErrorInfo}
      renderPanel={() => <CommentsPanel componentId={page.id} />}
    >
      <Panel>
        <Container>
          <PageTitle title={anotherTitle} />
          <div data-test="listId">
            <div>{selectedList.displayName}</div>

            {listId ? (
              <Description dangerouslySetInnerHTML={{ __html: listId }} />
            ) : (
              <Error large>Missing listId</Error>
            )}
          </div>

          <div data-test="anotherPositive">
            {anotherPositive ? (
              <OptionItem>
                <Input type="radio" />
                <OptionLabel>
                  {anotherPositive && (
                    <OptionDescription>{anotherPositive}</OptionDescription>
                  )}
                </OptionLabel>
              </OptionItem>
            ) : (
              <Error large>Missing anotherPositive</Error>
            )}
          </div>

          <div data-test="anotherPositiveDescription">
            {anotherPositiveDescription && (
              <Description
                dangerouslySetInnerHTML={{ __html: anotherPositiveDescription }}
              />
            )}
          </div>

          <div data-test="anotherNegative">
            {anotherNegative ? (
              <OptionItem>
                <Input type="radio" />
                <OptionLabel>
                  {anotherNegative && (
                    <OptionDescription>{anotherNegative}</OptionDescription>
                  )}
                </OptionLabel>
              </OptionItem>
            ) : (
              <Error large>Missing anotherNegative</Error>
            )}
          </div>

          <div data-test="anotherNegativeDescription">
            {anotherNegativeDescription && (
              <Description
                dangerouslySetInnerHTML={{ __html: anotherNegativeDescription }}
              />
            )}
          </div>

          {/* 
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
                    )} */}
        </Container>
      </Panel>
      <Panel>
        <Container>
          <div data-test="addItemTitle">
            {addItemTitle ? (
              <Description dangerouslySetInnerHTML={{ __html: addItemTitle }} />
            ) : (
              <Error large>Missing addItemTitle</Error>
            )}
          </div>

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
        </Container>
      </Panel>
    </EditorLayout>
  );
};

ListCollectorPagePreview.propTypes = {
  page: propType(ListCollectorPageEditor.fragments.ListCollectorPage),
};

export default ListCollectorPagePreview;
