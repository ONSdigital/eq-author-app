import React from "react";

import PropTypes from "prop-types";

import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";

import ShortCodeEditor from "components/ShortCodeEditor";

import DuplicateButton from "components/buttons/DuplicateButton";
import MoveButton from "components/buttons/MovePageButton";
import DeleteButton from "components/buttons/IconButtonDelete";

const EditorToolbar = ({
  shortCode,
  shortCodeOnUpdate,
  onMove,
  onDuplicate,
  onDelete,
  disableMove,
  disableDuplicate,
  disableDelete,
}) => (
  <Toolbar>
    <ShortCodeEditor shortCode={shortCode} onUpdate={shortCodeOnUpdate} />
    <Buttons>
      <MoveButton disabled={disableMove} onClick={onMove} />
      <DuplicateButton disabled={disableDuplicate} onClick={onDuplicate} />
      <DeleteButton disabled={disableDelete} onClick={onDelete} />
    </Buttons>
  </Toolbar>
);

EditorToolbar.propTypes = {
  shortCode: PropTypes.string.isRequired,
  shortCodeOnUpdate: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onDuplicate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  disableMove: PropTypes.bool,
  disableDuplicate: PropTypes.bool,
  disableDelete: PropTypes.bool,
};

export default EditorToolbar;
