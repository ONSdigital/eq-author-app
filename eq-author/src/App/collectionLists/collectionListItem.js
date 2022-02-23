import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { find } from "lodash";

import PropTypes from "prop-types";
import WrappingInput from "components/Forms/WrappingInput";
import { Label } from "components/Forms";

import { colors } from "constants/theme";
import Collapsible from "components/CollapsibleMoveable";
import AnswersEditor from "App/page/Design/QuestionPageEditor/AnswersEditor";
import AnswerTypeSelector from "components/AnswerTypeSelector";
import { listErrors } from "../../constants/validationMessages";

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const AnswerTypeSelectorWrapper = styled.div`
  margin-top: 1rem;
  width: 20rem;
`;

const AnswerEditorWrapper = styled.div`
  .answer {
    margin-left: 0;
  }
`;

// Lists
const ListInput = styled(WrappingInput)`
  width: 20rem;
  font-weight: bold;
`;

const ListItem = styled.div`
  ${"" /* border: 1px solid ${colors.bordersLight}; */}
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    ${"" /* box-shadow: 0 0 0 1px ${colors.blue}; */}
  }
  margin: 0 0 1em;
`;

const ListItemContents = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
`;

const CollectionListItem = ({
  handleDeleteList,
  handleUpdateList,
  handleCreateAnswer,
  handleDeleteAnswer,
  handleUpdateAnswer,
  handleAddOption,
  handleAddExclusive,
  handleUpdateOption,
  handleDeleteOption,
  list,
}) => {
  const { id, displayName, listName, answers } = list;
  const [tempListName, setListName] = useState(listName);
  useEffect(() => {
    setListName(listName);
  }, [listName]);
  let multipleAnswers = false;
  multipleAnswers = answers?.length > 1;
  const listnameError = find(list.validationErrorInfo.errors, {
    errorCode: "LISTNAME_MISSING",
  });
  return (
    <StyledGrid>
      <ListItem>
        <Collapsible
          className="listCollapsible"
          withoutHideThis
          title={displayName}
          handleDelete={handleDeleteList}
          defaultOpen
        >
          <ListItemContents>
            <Label for={`list-${id}`}>List name</Label>
            <ListInput
              id={`list-${id}`}
              aria-label="List name input"
              tabIndex="-1"
              value={tempListName}
              onChange={(event) => setListName(event.value)}
              onBlur={() => handleUpdateList(tempListName)}
              errorValidationMsg={
                listnameError?.errorCode
                  ? listErrors[listnameError.errorCode]
                  : null
              }
            />
            <AnswerEditorWrapper>
              <AnswersEditor
                answers={answers}
                onDeleteAnswer={(answerId) => handleDeleteAnswer(answerId)}
                onUpdate={handleUpdateAnswer}
                onAddOption={handleAddOption}
                onAddExclusive={handleAddExclusive}
                onUpdateOption={handleUpdateOption}
                onDeleteOption={handleDeleteOption}
                multipleAnswers={multipleAnswers}
                // metadata={metadata}
                page={list}
              />
            </AnswerEditorWrapper>
            <AnswerTypeSelectorWrapper>
              <AnswerTypeSelector
                answerCount={answers.length}
                onSelect={(answerType) => handleCreateAnswer(answerType)}
                data-test="add-answer"
                page={list}
              />
            </AnswerTypeSelectorWrapper>
          </ListItemContents>
        </Collapsible>
      </ListItem>
    </StyledGrid>
  );
};

CollectionListItem.propTypes = {
  handleDeleteList: PropTypes.func.isRequired,
  handleUpdateList: PropTypes.func.isRequired,
  handleCreateAnswer: PropTypes.func.isRequired,
  handleDeleteAnswer: PropTypes.func.isRequired,
  handleUpdateAnswer: PropTypes.func.isRequired,
  handleAddOption: PropTypes.func.isRequired,
  handleAddExclusive: PropTypes.func.isRequired,
  handleUpdateOption: PropTypes.func.isRequired,
  handleDeleteOption: PropTypes.func.isRequired,
  list: PropTypes.object.isRequired, //eslint-disable-line
};

export default CollectionListItem;