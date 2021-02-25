import React from "react";

import PropTypes from "prop-types";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";

import ShortCodeEditor from "components/ShortCodeEditor";

import DuplicateButton from "components/buttons/DuplicateButton";
import MoveButton from "components/buttons/MovePageButton";
import DeleteButton from "components/buttons/IconButtonDelete";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";

const EditorToolbar = ({
  shortCode,
  shortCodeOnUpdate,
  onMove,
  onDuplicate,
  onDelete,
  disableMove,
  disableDuplicate,
  disableDelete,
  showDeleteModal,
  handleModalClose,
  handleModalConfirm,
}) => (
  <>
    <Toolbar>
      <ShortCodeEditor shortCode={shortCode} onUpdate={shortCodeOnUpdate} />
      <Buttons>
        <MoveButton disabled={disableMove} onClick={onMove} />
        <DuplicateButton disabled={disableDuplicate} onClick={onDuplicate} />
        <DeleteButton disabled={disableDelete} onClick={onDelete} />
      </Buttons>
    </Toolbar>

    <DeleteConfirmDialog
      isOpen={showDeleteModal}
      onClose={handleModalClose}
      onDelete={handleModalConfirm}
      // title={displayName}
      alertText="All questions in this folder will also be removed. This may affect piping and routing rules elsewhere.."
      // icon={IconFolder}
      data-test="delete-questionnaire"
    />
  </>
);

EditorToolbar.propTypes = {
  shortCode: PropTypes.string.isRequired,
  shortCodeOnUpdate: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disableMove: PropTypes.bool,
  disableDelete: PropTypes.bool,
  disableDuplicate: PropTypes.bool,
  handleModalConfirm: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.bool.isRequired,
};

export default EditorToolbar;
