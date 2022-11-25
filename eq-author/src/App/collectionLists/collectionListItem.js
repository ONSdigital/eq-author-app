import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { find } from "lodash";

import PropTypes from "prop-types";
import WrappingInput from "components/Forms/WrappingInput";
import { Label } from "components/Forms";
import Modal from "components-themed/Modal";

import { colors } from "constants/theme";
import Collapsible from "components/CollapsibleMoveable";
import AnswersEditor from "App/page/Design/QuestionPageEditor/AnswersEditor";
import AnswerTypeSelector from "components/AnswerTypeSelector";
import { listErrors } from "../../constants/validationMessages";
import focusOnEntity from "utils/focusOnEntity";
import {
  DELETE_BUTTON_TEXT,
  DELETE_LIST_ITEM_TITLE,
} from "constants/modal-content";

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
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
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
  const { id, displayName, listName, answers, metadata } = list;
  const [tempListName, setListName] = useState(listName);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
      <Modal
        title={DELETE_LIST_ITEM_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={handleDeleteList}
        onClose={() => setShowDeleteModal(false)}
      />
      <ListItem>
        <Collapsible
          id={list.id}
          className="listCollapsible"
          withoutHideThis
          title={displayName}
          handleDelete={() => setShowDeleteModal(true)}
          hasError={Boolean(list.validationErrorInfo.errors.length)}
          defaultOpen
        >
          <ListItemContents>
            <Label htmlFor={`list-${id}`}>List name</Label>
            <ListInput
              id={`list-${id}`}
              aria-label="List name input"
              tabIndex="-1"
              value={tempListName}
              autoFocus
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
                metadata={metadata}
                page={list}
              />
            </AnswerEditorWrapper>
            <AnswerTypeSelectorWrapper>
              <AnswerTypeSelector
                answerCount={answers.length}
                onSelect={(answerType) =>
                  handleCreateAnswer(answerType).then((result) => {
                    const answers = result.data.createListAnswer.answers;
                    const answer = answers[answers.length - 1];
                    focusOnEntity(answer);
                  })
                }
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
