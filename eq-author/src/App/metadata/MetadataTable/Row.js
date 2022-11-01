import React, { useMemo, useState } from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";

import withEntityEditor from "components/withEntityEditor";
import Modal from "components-themed/Modal";

import {
  DeleteRowButton,
  TableInput,
  TableInputDate,
} from "components/datatable/Controls";
import { TableColumn, TableRow } from "components/datatable/Elements";
import { KeySelect, Select, FallbackSelect } from "./Controls";
import {
  TEXT,
  TEXT_OPTIONAL,
  DATE,
  LANGUAGE,
  REGION,
} from "constants/metadata-types";
import { EN, CY } from "constants/languages";
import { GB_ENG, GB_GBN, GB_NIR, GB_SCT, GB_WLS } from "constants/regions";

import {
  DELETE_METADATA_TITLE,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

export const getFallbackKeys = ({ key, type, allKeyData }) => {
  return allKeyData
    .filter(
      (row) =>
        row.key !== key &&
        (row.type === type || `${row.type}_Optional` === type)
    )
    .map(({ key }) => key);
};

export const StatelessRow = ({
  metadata: {
    id,
    key,
    fallbackKey,
    alias,
    type,
    dateValue,
    textValue,
    languageValue,
    regionValue,
  },
  onDelete,
  onChange,
  onUpdate,
  questionnaireId,
  usedKeys,
  keyData,
}) => {
  const fallbackKeys = useMemo(
    () => getFallbackKeys({ key, type, allKeyData: keyData }),
    [keyData, key, type]
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <TableRow data-test="metadata-table-row">
      <Modal
        title={DELETE_METADATA_TITLE}
        positiveButtonText={DELETE_BUTTON_TEXT}
        isOpen={showDeleteModal}
        onConfirm={() => onDelete(questionnaireId, id)}
        onClose={() => setShowDeleteModal(false)}
      />
      <TableColumn>
        <KeySelect
          onChange={onChange}
          onUpdate={onUpdate}
          defaultValue={key}
          name="key"
          usedKeys={usedKeys}
        />
      </TableColumn>
      <TableColumn>
        <TableInput
          id={"metadata-alias-column"}
          onChange={onChange}
          onBlur={onUpdate}
          value={alias}
          name="alias"
        />
      </TableColumn>
      <TableColumn>
        <Select
          onChange={onChange}
          onUpdate={onUpdate}
          value={type}
          options={[TEXT, TEXT_OPTIONAL, DATE, LANGUAGE, REGION]}
          name="type"
        />
      </TableColumn>
      <TableColumn>
        {(type === TEXT.value || type === TEXT_OPTIONAL.value) && (
          <TableInput
            id={"metadata-value-column"}
            onChange={onChange}
            onBlur={onUpdate}
            value={textValue}
            name="textValue"
          />
        )}
        {type === DATE.value && (
          <TableInputDate
            onChange={onChange}
            onBlur={onUpdate}
            value={dateValue}
            name="dateValue"
            type="date"
          />
        )}
        {type === REGION.value && (
          <Select
            onChange={onChange}
            onUpdate={onUpdate}
            value={regionValue}
            options={[GB_ENG, GB_GBN, GB_NIR, GB_SCT, GB_WLS]}
            name="regionValue"
          />
        )}
        {type === LANGUAGE.value && (
          <Select
            onChange={onChange}
            onUpdate={onUpdate}
            value={languageValue}
            options={[EN, CY]}
            name="languageValue"
          />
        )}
      </TableColumn>
      <TableColumn>
        <FallbackSelect
          onChange={onChange}
          onUpdate={onUpdate}
          options={fallbackKeys}
          defaultValue={fallbackKey}
          name="fallbackKey"
        />
      </TableColumn>
      <TableColumn>
        <DeleteRowButton
          data-test="metadata-delete-row"
          size="medium"
          onClick={() => setShowDeleteModal(true)}
        />
      </TableColumn>
    </TableRow>
  );
};

StatelessRow.propTypes = {
  metadata: CustomPropTypes.metadata.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  usedKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  keyData: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default withEntityEditor("metadata")(StatelessRow);
