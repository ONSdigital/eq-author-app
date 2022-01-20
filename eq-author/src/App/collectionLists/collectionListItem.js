import React from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";

import PropTypes from "prop-types";
import Input from "components-themed/Input";
import { Field, Label } from "components/Forms";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";
import { colors } from "constants/theme";

const StyledGrid = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const ListInput = styled(Input)`
  border-radius: 0;
  width: 26%;
  font-weight: bold;
`;

const ListItem = styled.div`
  border: 1px solid ${colors.bordersLight};
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
  margin: 0 0 1em;
`;

const ListItemContents = styled.div`
  padding: 1em;
`;
const ListHeader = styled.div`
  background: ${colors.blue};
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const ListNamePanel = styled.span`
  display: flex;
  background: ${colors.darkerBlue};
  color: ${colors.white};
  align-items: center;
`;

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

const Buttons = styled.div`
  display: flex;
  z-index: 2;
  button {
    margin-right: 0.2em;
  }
  button:last-of-type {
    margin-right: 0;
  }
`;

const CollectionListItem = ({ id, displayName, handleDeleteList }) => {
  return (
    <StyledGrid>
      <ListItem>
        <ListHeader>
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
                  // disabled={!this.props.canMoveUp}
                  // tabIndex={!this.props.canMoveUp ? -1 : undefined}
                  aria-label={"Move answer up"}
                  // onClick={this.props.onMoveUp}
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
                  // disabled={!this.props.canMoveDown}
                  // tabIndex={!this.props.canMoveDown ? -1 : undefined}
                  aria-label={"Move answer down"}
                  // onClick={this.props.onMoveDown}
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
        </ListHeader>

        <ListItemContents>
          <Label for="listName">List name</Label>
          <ListInput
            id="listName"
            aria-label="List name input"
            tabIndex="-1"
            value={displayName}
          />
        </ListItemContents>
      </ListItem>
    </StyledGrid>
  );
};

CollectionListItem.propTypes = {
  id: PropTypes.string.isRequired,
  listName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
};

export default CollectionListItem;
