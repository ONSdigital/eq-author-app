import React from "react";
import styled, { css } from "styled-components";

import PropTypes from "prop-types";
import Input from "components-themed/Input";
import { Label } from "components/Forms";
import { useMutation } from "@apollo/react-hooks";
import Error from "components/Error";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import ValidationError from "components/ValidationError";
import { QUESTION_ANSWER_NOT_SELECTED } from "constants/validationMessages";
import Popout, { Container, Layer } from "components/Popout";
import Button from "components/buttons/Button";
import AddIcon from "./icon-add.svg?inline";
import IconText from "components/IconText";

import { colors } from "constants/theme";
import Collapsible from "components/Collapsible";

// import withValidationError from "enhancers/withValidationError";

// import PopupTransition from "./page/Design/QuestionPageEditor/AnswerTypeSelector/PopupTransition";
// import AnswerTypeGrid from "./page/Design/QuestionPageEditor/AnswerTypeSelector/AnswerTypeGrid";

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;
// Lists
const ListInput = styled(Input)`
  border-radius: 0;
  width: 30%;
  font-weight: bold;

  margin-bottom: 2em;
`;

const ListItem = styled.div`
  ${'' /* border: 1px solid ${colors.bordersLight}; */}
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    ${'' /* box-shadow: 0 0 0 1px ${colors.blue}; */}
  }
  margin: 0 0 1em;
`;

const ListItemContents = styled.div`
  padding: 1em;
`;
// const ListHeader = styled.div`
//   ${'' /* background: ${colors.blue}; */}
//   background: ${colors.green};
//   border-bottom: 1px solid ${colors.bordersLight};
//   display: flex;
//   align-items: center;
//   justify-content: flex-start;
//   margin-left: 1em;
// `;

// const ListNamePanel = styled.span`
//   display: flex;
//   ${'' /* background: ${colors.darkerBlue}; */}
//   background: ${colors.red};
//   color: ${colors.white};
//   align-items: center;
// `;

const ListName = styled.span`
  line-height: 1;
  z-index: 1;
  font-family: Lato, sans-serif;
  font-size: 0.9em;
  letter-spacing: 0;
  font-weight: bold;
  padding-left: 1.6em;
  padding-right: 2em;
`;
// Answers

const AnswerInput = styled(Input)`
  border-radius: 0;
  width: 100%;
  font-weight: bold;
`;

const AnswerItem = styled.div`
  border: 1px solid ${colors.bordersLight};
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
  margin: 0 0 1em;
`;

const AnswerItemContents = styled.div`
  padding: 1em;
`;
const AnswerHeader = styled.div`
  background: ${colors.blue};
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const AnswerNamePanel = styled.span`
  display: flex;
  background: ${colors.darkerBlue};
  color: ${colors.white};
  align-items: center;
`;

const AnswerName = styled.span`
  line-height: 1;
  z-index: 1;
  font-family: Lato, sans-serif;
  font-size: 0.9em;
  letter-spacing: 0;
  font-weight: bold;
  padding-left: 1.6em;
  padding-right: 2em;
`;

// const Buttons = styled.div`
//   display: flex;
//   z-index: 2;
//   button {
//     margin-right: 0.2em;
//   }
//   button:last-of-type {
//     margin-right: 0;
//   }
// `;

const PopoutContainer = styled(Container)`
  width: 100%;
`;

const PopoutLayer = styled(Layer)`
  width: 24em;
  right: 0;
  left: 0;
  bottom: 3.5em;
  margin: 0 auto;
  z-index: 10;
`;

const ErrorContext = styled.div`
  position: relative;

  ${(props) =>
    props.isInvalid &&
    css`
      border: 1px solid ${colors.errorPrimary};
      padding: 1em;
    `}
`;

const AddAnswerButton = styled(Button)`
  width: 33%;
  padding: 0.5em;
`;

// const trigger = (
//   <AddAnswerButton variant="secondary" data-test="btn-add-list-answer">
//     <IconText icon={AddIcon}>Add an answer</IconText>
//   </AddAnswerButton>
// );

const CollectionListItem = ({
  id,
  displayName,
  answers,
  handleDeleteList,
  handleUpdateList,
  handleChange,
  handleCreateAnswer,
  handleDeleteAnswer,
  type,
}) => {
  // console.log(answers[0].__typename);
  return (
    <StyledGrid>
      <ListItem>
        
          {/* <ListHeader>
            <ListNamePanel>
              <ListName data-test="answer-type">{displayName}</ListName>
              <Buttons>
                <Tooltip
                  content="Move answer up"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <MoveButton
                    color="white"
                    disabled
                    aria-label={"Move answer up"}
                    data-test="btn-move-answer-up"
                  >
                    <IconUp />
                  </MoveButton>
                </Tooltip>
                <Tooltip
                  content="Move answer down"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <MoveButton
                    color="white"
                    disabled
                    aria-label={"Move answer down"}
                    data-test="btn-move-answer-down"
                  >
                    <IconDown />
                  </MoveButton>
                </Tooltip>
                <Tooltip
                  content="Delete answer"
                  place="top"
                  offset={{ top: 0, bottom: 10 }}
                >
                  <DeleteButton
                    color="white"
                    size="medium"
                    onClick={() => handleDeleteList(id)}
                    aria-label="Delete answer"
                    data-test="btn-delete-answer"
                  />
                </Tooltip>
              </Buttons>
            </ListNamePanel>
          </ListHeader> */}

        <Collapsible
          className="listCollapsible"
          withoutHideThis
          variant="list"
          displayName={displayName}
          handleDeleteList={handleDeleteList}
        >


        <ListItemContents>
          <Label for="listName">List name</Label>
          <ListInput
            id="listName"
            aria-label="List name input"
            tabIndex="-1"
            value={displayName}
            onChange={handleChange()}
            onBlur={() => handleUpdateList(id, displayName)}
          />
          {answers === null || answers === undefined || !answers.length ? (
            <Error>Currently no answers</Error>
          ) : (
            answers.map(({ id, __typename, displayName, type }) => (
              <AnswerItem key={id}>
                <AnswerHeader>
                  <AnswerNamePanel>
                    <AnswerName data-test="answer-type">{type}</AnswerName>
                    <Buttons>
                      <Tooltip
                        content="Move answer up"
                        place="top"
                        offset={{ top: 0, bottom: 10 }}
                      >
                        <MoveButton
                          color="white"
                          disabled
                          aria-label={"Move answer up"}
                          data-test="btn-move-answer-up"
                        >
                          <IconUp />
                        </MoveButton>
                      </Tooltip>
                      <Tooltip
                        content="Move answer down"
                        place="top"
                        offset={{ top: 0, bottom: 10 }}
                      >
                        <MoveButton
                          color="white"
                          disabled
                          aria-label={"Move answer down"}
                          data-test="btn-move-answer-down"
                        >
                          <IconDown />
                        </MoveButton>
                      </Tooltip>
                      <Tooltip
                        content="Delete answer"
                        place="top"
                        offset={{ top: 0, bottom: 10 }}
                      >
                        <DeleteButton
                          color="white"
                          size="medium"
                          onClick={() => handleDeleteAnswer(id)}
                          aria-label="Delete answer"
                          data-test="btn-delete-answer"
                        />
                      </Tooltip>
                    </Buttons>
                  </AnswerNamePanel>
                </AnswerHeader>

                <AnswerItemContents>
                  <Label for="answerName">Label</Label>
                  <AnswerInput
                    id="answerName"
                    aria-label="Answer Label input"
                    tabIndex="-1"
                    value={displayName}
                    // onChange={handleChange()}
                    // onBlur={() => handleUpdateList(id, displayName)}
                  />
                </AnswerItemContents>
              </AnswerItem>

              // end answers
            ))
          )}

          <AddAnswerButton
            variant="secondary"
            data-test="btn-add-list-answer"
            onClick={() => handleCreateAnswer(id, (type = "Number"))}
          >
            <IconText icon={AddIcon}>Add an answer</IconText>
          </AddAnswerButton>
        </ListItemContents>

        </Collapsible>        
      </ListItem>
    </StyledGrid>
  );
};

CollectionListItem.propTypes = {
  handleDeleteList: PropTypes.func.isRequired,
  handleUpdateList: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleCreateAnswer: PropTypes.func.isRequired,
  handleDeleteAnswer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  answers: PropTypes.string.isRequired,
};

export default CollectionListItem;
