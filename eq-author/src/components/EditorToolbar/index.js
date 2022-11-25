import React, { useState } from "react";

import PropTypes from "prop-types";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";

import ShortCodeEditor from "components/ShortCodeEditor";
import DuplicateButton from "components/buttons/DuplicateButton";
import MoveButton from "components/buttons/MovePageButton";
import DeleteButton from "components/buttons/IconButtonDelete";
import MoveFolderModal from "App/page/Design/MoveEntityModal";

import Modal from "components-themed/Modal";

import {
  DELETE_FOLDER_TITLE,
  DELETE_FOLDER_WARNING,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const EditorToolbar = ({
  shortCode,
  shortCodeOnUpdate,
  onMove,
  onDuplicate,
  onDelete,
  disableMove,
  disableDuplicate,
  disableDelete,
  data,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveFolderModal, setMoveFolderModal] = useState(false);

  const handleDeleteButtonClick = () => {
    setShowDeleteModal(false);
    onDelete();
  };

  return (
    <>
      <Toolbar>
        <ShortCodeEditor shortCode={shortCode} onUpdate={shortCodeOnUpdate} />
        <Buttons>
          <MoveButton
            data-test="btn-move-folder"
            disabled={disableMove}
            onClick={() => setMoveFolderModal(true)}
          />
          <DuplicateButton
            data-test="btn-duplicate-folder"
            disabled={disableDuplicate}
            onClick={onDuplicate}
          />
          <DeleteButton
            data-test="btn-delete-folder"
            disabled={disableDelete}
            onClick={() => setShowDeleteModal(true)}
          />
        </Buttons>
      </Toolbar>

      <Modal
        title={DELETE_FOLDER_TITLE}
        warningMessage={DELETE_FOLDER_WARNING}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => handleDeleteButtonClick()}
        onClose={() => setShowDeleteModal(false)}
      />
      <MoveFolderModal
        isOpen={showMoveFolderModal}
        onClose={() => setMoveFolderModal(false)}
        onMove={(args) => {
          onMove(args);
          setMoveFolderModal(false);
        }}
        sectionId={data.section.id}
        selected={data}
        entity="Folder"
      />
    </>
  );
};

EditorToolbar.propTypes = {
  shortCode: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  pageType: PropTypes.string.isRequired,
  shortCodeOnUpdate: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disableMove: PropTypes.bool,
  disableDuplicate: PropTypes.bool,
  disableDelete: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
};

export default EditorToolbar;
