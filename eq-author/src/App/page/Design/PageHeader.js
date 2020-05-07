import React from "react";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import iconPage from "./icon-dialog-page.svg";
import { isFunction, flowRight } from "lodash";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";

import Button from "components/buttons/Button";
import IconText from "components/IconText";
import DuplicateButton from "components/buttons/DuplicateButton";
import { Label } from "components/Forms";
import VisuallyHidden from "components/VisuallyHidden";
import AliasEditor from "components/AliasEditor";

import withMovePage from "./withMovePage";
import withDeletePage from "./withDeletePage";
import withDuplicatePage from "./withDuplicatePage";
import MovePageQuery from "./MovePageModal/MovePageQuery";
import { Toolbar, Buttons } from "./EditorToolbar";
import IconMove from "./EditorToolbar/icon-move.svg?inline";
import MovePageModal from "./MovePageModal";
import styled from "styled-components";

const StyleToolbar = styled(Toolbar)`
  align-items: flex-start;
`;

export class PageHeader extends React.Component {
  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false,
  };

  handleDuplicatePage = e => {
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

  handleCloseDeleteConfirmDialog = cb =>
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

  handleCloseMovePageDialog = cb => {
    this.setState({ showMovePageDialog: false }, isFunction(cb) ? cb : null);
  };

  handleMovePage = args => {
    this.handleCloseMovePageDialog(() => this.props.onMovePage(args));
  };

  renderMovePageModal = ({ loading, error, data }) => {
    const { page } = this.props;
    if (loading || error) {
      return null;
    }

    return (
      <MovePageModal
        questionnaire={data.questionnaire}
        isOpen={this.state.showMovePageDialog}
        onClose={this.handleCloseMovePageDialog}
        onMovePage={this.handleMovePage}
        sectionId={page.section.id}
        page={page}
      />
    );
  };

  render() {
    const {
      page,
      onChange,
      onUpdate,
      match,
      isMoveDisabled,
      isDuplicateDisabled,
      alertText,
    } = this.props;
    return (
      <React.Fragment>
        <StyleToolbar>
          <div>
            <Label htmlFor="alias">Short code</Label>
            <AliasEditor
              alias={page.alias}
              onUpdate={onUpdate}
              onChange={onChange}
            />
          </div>
          <Buttons>
            <Button
              onClick={this.handleOpenMovePageDialog}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled={isMoveDisabled}
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={this.handleDuplicatePage}
              data-test="btn-duplicate-page"
              disabled={isDuplicateDisabled}
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={this.handleOpenDeleteConfirmDialog}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </StyleToolbar>
        <DeleteConfirmDialog
          isOpen={this.state.showDeleteConfirmDialog}
          onClose={this.handleCloseDeleteConfirmDialog}
          onDelete={this.handleDeletePageConfirm}
          title={page.displayName}
          alertText={alertText}
          icon={iconPage}
          data-test="delete-page"
        />
        <MovePageQuery questionnaireId={match.params.questionnaireId}>
          {this.renderMovePageModal}
        </MovePageQuery>
      </React.Fragment>
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
};

export default flowRight(
  withMovePage,
  withDeletePage,
  withDuplicatePage
)(PageHeader);
