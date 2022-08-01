/* eslint-disable jsx-a11y/href-no-hash */
/* eslint-disable react/no-danger */
import React from "react";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { useQuery } from "@apollo/react-hooks";
import IconText from "components/IconText";
import Error from "components/preview/Error";
import { Answer } from "components/preview/Answers";
import PageTitle from "components/preview/elements/PageTitle";
import EditorLayout from "components/EditorLayout";

import { colors } from "constants/theme";
import COLLECTION_LISTS from "graphql/lists/collectionLists.graphql";
import ListCollectorPageEditor from "../Design/ListCollectorPageEditor";
import CommentsPanel from "App/Comments";
import Loading from "components/Loading";

import IconInfo from "./icon-info.svg?inline";
import IconChevron from "./icon-chevron.svg";
import Panel from "components/Panel";

const CollectorInfoTop = styled.div`
  width: 80%;
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
    white-space: pre;
  }
`;

const OptionLabel = styled.label`
  display: block;
  font-size: 1em;
  color: inherit;
  line-height: 1.4;
  font-weight: 600;
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
  font-size: 1em;
  margin-top: 0.2em;
  color: ${colors.text};
  width: 100%;
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

export const Description = styled.div`
  margin-bottom: 1em;
  word-wrap: break-word;
`;

const Answers = styled.div`
  margin-bottom: 1em;
`;

const Summary = styled.div`
  padding-bottom: 1em;
  border-bottom: 1px solid ${colors.lightGrey};
  margin-bottom: 1em;
  span {
    padding-right: 1em;
  }
  a {
    float: right;
    padding-left: 1em;
  }
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
    drivingQuestion,
    drivingPositive,
    drivingNegative,
    drivingPositiveDescription,
    drivingNegativeDescription,
    anotherTitle,
    anotherPositive,
    anotherNegative,
    anotherPositiveDescription,
    anotherNegativeDescription,
    addItemTitle,
    comments,
  } = page;

  const { data, loading } = useQuery(COLLECTION_LISTS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <EditorLayout>
        <Loading height="100%">Questionnaire lists loading…</Loading>
      </EditorLayout>
    );
  }

  let lists = [];

  if (data) {
    lists = data.collectionLists?.lists || [];
  }
  let selectedList = [];
  let answers = [];
  if (page.listId) {
    selectedList = lists.find(({ id }) => id === page.listId);
    if (selectedList.answers) {
      answers = selectedList.answers;
    }
  }

  return (
    <EditorLayout
      preview
      title={page.displayName}
      validationErrorInfo={page.validationErrorInfo}
      renderPanel={() => (
        <CommentsPanel comments={page.comments} componentId={page.id} />
      )}
      comments={comments}
    >
      <Panel>
        <Container>
          <CollectorInfoTop>
            {drivingQuestion ? (
              <PageTitle title={drivingQuestion} />
            ) : (
              <Error large>Missing driving question</Error>
            )}

            <div data-test="drivingPositive">
              {drivingPositive ? (
                <OptionItem>
                  <Input type="radio" />
                  <OptionLabel>
                    {drivingPositive && (
                      <OptionDescription>{drivingPositive}</OptionDescription>
                    )}
                  </OptionLabel>
                </OptionItem>
              ) : (
                <Error large>Missing drivingPositive</Error>
              )}
            </div>

            <div data-test="drivingPositiveDescription">
              {drivingPositiveDescription && (
                <Description
                  dangerouslySetInnerHTML={{
                    __html: drivingPositiveDescription,
                  }}
                />
              )}
            </div>

            <div data-test="drivingNegative">
              {drivingNegative ? (
                <OptionItem>
                  <Input type="radio" />
                  <OptionLabel>
                    {drivingNegative && (
                      <OptionDescription>{drivingNegative}</OptionDescription>
                    )}
                  </OptionLabel>
                </OptionItem>
              ) : (
                <Error large>Missing drivingNegative</Error>
              )}
            </div>

            <div data-test="drivingNegativeDescription">
              {drivingNegativeDescription && (
                <Description
                  dangerouslySetInnerHTML={{
                    __html: anotherNegativeDescription,
                  }}
                />
              )}
            </div>
          </CollectorInfoTop>
        </Container>
      </Panel>
      <Panel>
        <Container>
          <CollectorInfoTop>
            {anotherTitle ? (
              <PageTitle title={anotherTitle} />
            ) : (
              <Error large>Missing repeating list collector question</Error>
            )}

            {anotherTitle ? (
              <Summary>
                {answers.map((answer) => (
                  <span key={answer.id} value={answer.id}>
                    {answer.displayName}
                  </span>
                ))}
                <a href="#">Remove</a>
                <a href="#">Change</a>
              </Summary>
            ) : (
              <Summary>Missing Answers</Summary>
            )}
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
                  dangerouslySetInnerHTML={{
                    __html: anotherPositiveDescription,
                  }}
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
                  dangerouslySetInnerHTML={{
                    __html: anotherNegativeDescription,
                  }}
                />
              )}
            </div>
          </CollectorInfoTop>
        </Container>
      </Panel>
      <Panel>
        <Container>
          {addItemTitle ? (
            <PageTitle title={addItemTitle} />
          ) : (
            <Error large>Missing collection question</Error>
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
        </Container>
      </Panel>
    </EditorLayout>
  );
};

ListCollectorPagePreview.propTypes = {
  page: propType(ListCollectorPageEditor.fragments.ListCollectorPage),
};

export default ListCollectorPagePreview;
