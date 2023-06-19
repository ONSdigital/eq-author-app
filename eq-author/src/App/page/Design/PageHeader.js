import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { propType } from "graphql-anywhere";
import { isFunction, flowRight } from "lodash";

import { withQuestionnaire } from "components/QuestionnaireContext";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/buttons/DuplicateButton";
import { Label } from "components/Forms";
import AliasEditor from "components/AliasEditor";
import Modal from "components-themed/Modal";

import {
  DELETE_QUESTION_PAGE_TITLE,
  DELETE_CALCULATED_SUMMARY_TITLE,
  DELETE_LIST_COLLECTOR_TITLE,
  DELETE_BUTTON_TEXT,
  DELETE_PAGE_WARNING,
} from "constants/modal-content";
import isListCollectorPageType from "utils/isListCollectorPageType";

import withMovePage from "./withMovePage";
import withDeletePage from "./withDeletePage";
import withDuplicatePage from "./withDuplicatePage";
import { Toolbar, Buttons } from "./EditorToolbar";
import IconMove from "assets/icon-move.svg?inline";
import MovePageModal from "./MoveEntityModal";

const ShortCodeLabel = styled(Label)`
  grid-column-start: 1;
  grid-row-start: 1;
  align-self: end;
`;

export class PageHeader extends React.Component {
  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false,
  };

  handleDuplicatePage = (e) => {
    e.preventDefault();
    const { match, onDuplicatePage, page } = this.props;
    onDuplicatePage({
      sectionId: match.params.sectionId,
      pageId: page.id,
      position: page.position + 1,
    });
  };

  handleOpenDeleteConfirmDialog = () =>
    this.setState({ showDeleteConfirmDialog: true });

  handleCloseDeleteConfirmDialog = (cb) =>
    this.setState(
      { showDeleteConfirmDialog: false },
      isFunction(cb) ? cb : null
    );

  handleDeletePageConfirm = () => {
    const { onDeletePage, page } = this.props;
    this.handleCloseDeleteConfirmDialog(() => onDeletePage(page));
  };

  handleOpenMovePageDialog = () => {
    this.setState({ showMovePageDialog: true });
  };

  handleCloseMovePageDialog = (cb) => {
    this.setState({ showMovePageDialog: false }, isFunction(cb) ? cb : null);
  };

  handleMovePage = (args) => {
    this.handleCloseMovePageDialog(() => this.props.onMovePage(args));
  };

  isMoveDisabled = (questionnaire) =>
    (questionnaire.sections[0].folders[0]?.pages.length <= 1 &&
      questionnaire.sections[0].folders.length <= 1 &&
      questionnaire.sections.length === 1) ||
    isListCollectorPageType(this.props.page.pageType);

  deleteModalTitle = (pageType) => {
    switch (pageType) {
      case "QuestionPage":
        return DELETE_QUESTION_PAGE_TITLE;
      case "CalculatedSummaryPage":
        return DELETE_CALCULATED_SUMMARY_TITLE;
      case "ListCollectorPage":
        return DELETE_LIST_COLLECTOR_TITLE;
      default:
        return DELETE_QUESTION_PAGE_TITLE;
    }
  };

  render() {
    const {
      page,
      onChange,
      onUpdate,
      isDuplicateDisabled,
      questionnaire,
      alias,
    } = this.props;

    return (
      <>
        <Toolbar>
          <ShortCodeLabel htmlFor="alias">Short code</ShortCodeLabel>
          <AliasEditor
            alias={alias ?? page.alias}
            onUpdate={onUpdate}
            onChange={onChange}
          />
          <Buttons>
            <Button
              onClick={this.handleOpenMovePageDialog}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled={questionnaire && this.isMoveDisabled(questionnaire)}
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={this.handleDuplicatePage}
              data-test="btn-duplicate-page"
              disabled={
                isDuplicateDisabled || isListCollectorPageType(page.pageType)
              }
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={this.handleOpenDeleteConfirmDialog}
              disabled={isListCollectorPageType(page.pageType)}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <Modal
          title={this.deleteModalTitle(page.pageType)}
          warningMessage={DELETE_PAGE_WARNING}
          positiveButtonText={DELETE_BUTTON_TEXT}
          isOpen={this.state.showDeleteConfirmDialog}
          onConfirm={this.handleDeletePageConfirm}
          onClose={this.handleCloseDeleteConfirmDialog}
        />
        <MovePageModal
          isOpen={this.state.showMovePageDialog}
          onClose={this.handleCloseMovePageDialog}
          onMove={this.handleMovePage}
          sectionId={page.section.id}
          selected={page}
          entity="Page"
        />
      </>
    );
  }
}

PageHeader.fragments = {
  PageHeader: gql`
    fragment Page on Page {
      id
      position
      alias
      displayName
      section {
        id
      }
    }
  `,
};

PageHeader.propTypes = {
  page: propType(PageHeader.fragments.PageHeader),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  questionnaire: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isMoveDisabled: PropTypes.bool,
  isDuplicateDisabled: PropTypes.bool,
  onMovePage: PropTypes.func.isRequired,
  onDeletePage: PropTypes.func.isRequired,
  onDuplicatePage: PropTypes.func.isRequired,
  alertText: PropTypes.string.isRequired,
  alias: PropTypes.string,
};

export default flowRight(
  withMovePage,
  withDeletePage,
  withDuplicatePage,
  withQuestionnaire
)(PageHeader);
