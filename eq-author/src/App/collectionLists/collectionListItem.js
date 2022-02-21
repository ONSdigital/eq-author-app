import React, { useState, useEffect } from "react";
import styled from "styled-components";

import PropTypes from "prop-types";
import Input from "components-themed/Input";
import { Label } from "components/Forms";
import Button from "components/buttons/Button";
import AddIcon from "./icon-add.svg?inline";
import IconText from "components/IconText";

import { colors } from "constants/theme";
import Collapsible from "components/Collapsible";
import AnswersEditor from "App/page/Design/QuestionPageEditor/AnswersEditor";

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
  padding: 1em;
  display: flex;
  flex-direction: column;
`;

const AddAnswerButton = styled(Button)`
  width: 33%;
  padding: 0.5em;
`;

const CollectionListItem = ({
  id,
  displayName,
  answers,
  handleDeleteList,
  handleUpdateList,
  handleCreateAnswer,
  handleDeleteAnswer,
  handleUpdateAnswer,
  list,
}) => {
  const [listName, setListName] = useState(displayName);
  useEffect(() => {
    setListName(displayName);
  }, [displayName]);

  return (
    <StyledGrid>
      <ListItem>
        <Collapsible
          className="listCollapsible"
          withoutHideThis
          variant="list"
          displayName={displayName}
          handleDeleteList={handleDeleteList}
        >
          <ListItemContents>
            <Label for={`list-${id}`}>List name</Label>
            <ListInput
              id={`list-${id}`}
              aria-label="List name input"
              tabIndex="-1"
              value={listName}
              onChange={(event) => setListName(event.value)}
              onBlur={() => handleUpdateList(listName)}
            />
            <AnswersEditor
              answers={answers}
              onDeleteAnswer={(answerId) => handleDeleteAnswer(answerId)}
              onUpdate={handleUpdateAnswer}
              page={list}
            />
            <AddAnswerButton
              variant="secondary"
              data-test="btn-add-list-answer"
              onClick={handleCreateAnswer}
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
  handleCreateAnswer: PropTypes.func.isRequired,
  handleDeleteAnswer: PropTypes.func.isRequired,
  handleUpdateAnswer: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  answers: PropTypes.string.isRequired,
  list: PropTypes.object.isRequired, //eslint-disable-line
};

export default CollectionListItem;
