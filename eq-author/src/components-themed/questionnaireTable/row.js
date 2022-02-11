import React, { useState, useRef, useEffect } from "react";
import Tooltip from "components/Forms/Tooltip";

import PropTypes from "prop-types";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { rgba } from "polished";

import CustomPropTypes from "custom-prop-types";

import IconButtonDelete from "components/buttons/IconButtonDelete";
import DuplicateButton from "components/buttons/DuplicateButton";
import Truncated from "components/Truncated";
import Button from "components-themed/buttons/button";

import { colors } from "constants/theme";
import * as Headings from "constants/table-headings";

import FormattedDate from "./FormattedDate.js";
import questionConfirmationIcon from "assets/icon-questionnaire.svg";
import { ReactComponent as StarredIcon } from "assets/icon-starred.svg";
import { ReactComponent as UnstarredIcon } from "assets/icon-unstarred.svg";
import { ReactComponent as LockedIcon } from "assets/icon-locked.svg";
import { ReactComponent as UnlockedIcon } from "assets/icon-unlocked.svg";

export const QuestionnaireLink = styled.span`
  text-decoration: none;
  color: ${colors.blue};
  padding: 0 0.5em;
  display: flex;
  flex-direction: column;
  margin-left: -0.5em;
  &:focus {
    outline: none;
  }
  ${(props) =>
    props.linkHasFocus &&
    props.questionnaireModal &&
    `
      color: white;
      :nth-of-type(2n-1) {
        color: white;
      }
    `}
`;

export const IconTextButton = styled(Button).attrs({
  small: true,
  variant: "tertiary",
})`
  padding: 0.5em 0.65em;
  margin-left: 0.35em;
  svg {
    display: block;
    margin: auto;
  }
  &:hover svg * {
    transition: 0.1s;
    fill: ${colors.white};
  }
`;

export const ShortTitle = styled.span`
  color: ${colors.textLight};
  text-decoration-color: ${colors.textLight};
  font-size: 0.8em;
  font-weight: bold;
  letter-spacing: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
`;

export const TR = styled.tr`
  scroll-margin-top: 3em;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
  background-color: rgba(0, 0, 0, 0);
  :nth-of-type(2n-1) {
    background-color: rgba(0, 0, 0, 0.02);
  }
  opacity: 1;
  height: 3.2em;
  position: relative;

  &:hover {
    background-color: ${rgba(colors.primary, 0.1)};
    cursor: pointer;
  }
`;

const TD = styled.td`
  line-height: 1.3;
  padding-left: 0.5em;
  font-size: 0.9em;
  overflow: hidden;
  text-overflow: ellipsis;

  &:first-of-type {
    padding-left: 1em;
  }
`;

export const DuplicateQuestionnaireButton = styled(DuplicateButton).attrs({
  disableOnClick: false,
})`
  margin-right: 0.5em;
`;

const Permissions = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0 0 0 0.5em;
  display: flex;
`;

const Permission = styled.li`
  background: ${colors.darkGrey};
  font-weight: bold;
  line-height: 1.2;
  padding: 0.2em 0.7em;
  border-radius: 1em;
  color: white;
  letter-spacing: 0.05em;
  font-size: 0.7em;
  text-transform: initial;
  :not(:last-of-type) {
    margin-right: 0.5em;
  }
`;

export const Row = ({
  questionnaire: {
    shortTitle,
    createdBy,
    title,
    createdAt,
    displayName,
    updatedAt,
    starred,
    locked,
  },
  selected,
  tableHeadings,
}) => {
  const renderEnabled = (heading) => {
    switch (heading) {
      case Headings.TITLE:
        return (
          <TD key={heading}>
            <QuestionnaireLink
              data-test="anchor-questionnaire-title"
              title={displayName}
              tabIndex="0"
            >
              {shortTitle && (
                <ShortTitle>
                  <Truncated>{shortTitle}</Truncated>
                </ShortTitle>
              )}
              <Truncated>{title}</Truncated>
            </QuestionnaireLink>
          </TD>
        );
      case Headings.OWNER:
        return <TD key={heading}>{createdBy.displayName}</TD>;
      case Headings.CREATED:
        return (
          <TD key={heading}>
            <FormattedDate date={createdAt} />
          </TD>
        );
      case Headings.MODIFIED:
        return (
          <TD key={heading}>
            <FormattedDate date={updatedAt} />
          </TD>
        );
      case Headings.PERMISSIONS:
        return (
          <TD key={heading}>
            <Permissions>
              <Permission>View</Permission>
              <Permission disabled={false}>Edit</Permission>
            </Permissions>
          </TD>
        );
      case Headings.LOCKED:
        return (
          <TD key={heading}>
            <IconTextButton
              title="Lock"
              data-test="lockButton"
              disabled={false}
            >
              {locked ? <LockedIcon /> : <UnlockedIcon />}
            </IconTextButton>
          </TD>
        );
      case Headings.STARRED:
        return (
          <TD key={heading}>
            <Tooltip content={starred ? "Starred" : "Not starred"} place="top">
              <IconTextButton title="Star" data-test="starButton">
                {starred ? <StarredIcon /> : <UnstarredIcon />}
              </IconTextButton>
            </Tooltip>
          </TD>
        );
      case Headings.ACTIONS:
        return (
          <TD key={heading}>
            <ButtonGroup>
              {/* might need another div - see other row file */}
            </ButtonGroup>
          </TD>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TR selected={selected} data-test="table-row">
        {tableHeadings.map(renderEnabled)}
      </TR>
    </>
  );
};

export default withRouter(Row);
