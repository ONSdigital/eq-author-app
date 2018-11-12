import React, { Component } from "react";
import CustomPropTypes from "custom-prop-types";
import metadataFragment from "graphql/fragments/metadata.graphql";
import PropTypes from "prop-types";

import withEntityEditor from "components/withEntityEditor";
import {
  DeleteRowButton,
  TableInput,
  TableInputDate
} from "components/DataTable/Controls";
import { TableColumn, TableRow } from "components/DataTable/Elements";
import { KeySelect, Select } from "components/MetadataTable/Controls";
import { TEXT, DATE, LANGUAGE, REGION } from "constants/metadata-types";
import { EN, CY } from "constants/languages";
import { GB_ENG, GB_GBN, GB_NIR, GB_SCT, GB_WLS } from "constants/regions";

export class StatelessRow extends Component {
  render() {
    const {
      metadata: {
        id,
        key,
        alias,
        type,
        dateValue,
        textValue,
        languageValue,
        regionValue
      },
      onDelete,
      onChange,
      onUpdate,
      questionnaireId,
      usedKeys
    } = this.props;
    return (
      <TableRow data-test="metadata-table-row">
        <TableColumn>
          <KeySelect
            onChange={onChange}
            onUpdate={onUpdate}
            defaultValue={key || ""}
            name="key"
            usedKeys={usedKeys}
          />
        </TableColumn>
        <TableColumn>
          <TableInput
            onChange={onChange}
            onBlur={onUpdate}
            value={alias || ""}
            name="alias"
          />
        </TableColumn>
        <TableColumn>
          <Select
            onChange={onChange}
            onUpdate={onUpdate}
            value={type}
            options={[TEXT, DATE, LANGUAGE, REGION]}
            name="type"
          />
        </TableColumn>
        <TableColumn>
          {type === TEXT && (
            <TableInput
              onChange={onChange}
              onBlur={onUpdate}
              value={textValue || ""}
              name="textValue"
            />
          )}
          {type === DATE && (
            <TableInputDate
              onChange={onChange}
              onBlur={onUpdate}
              value={dateValue}
              name="dateValue"
              type="date"
            />
          )}
          {type === REGION && (
            <Select
              onChange={onChange}
              onUpdate={onUpdate}
              value={regionValue}
              options={[GB_ENG, GB_GBN, GB_NIR, GB_SCT, GB_WLS]}
              name="regionValue"
            />
          )}
          {type === LANGUAGE && (
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
          <DeleteRowButton
            data-test="metadata-delete-row"
            size="medium"
            onClick={() => onDelete(questionnaireId, id)}
          />
        </TableColumn>
      </TableRow>
    );
  }
}

StatelessRow.propTypes = {
  metadata: CustomPropTypes.metadata.isRequired,
  questionnaireId: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  usedKeys: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default withEntityEditor("metadata", metadataFragment)(StatelessRow);
