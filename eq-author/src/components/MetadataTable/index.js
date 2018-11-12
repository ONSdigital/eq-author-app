import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { map } from "lodash";
import fp from "lodash/fp";

import {
  Table,
  TableHead,
  TableBody,
  TableFoot,
  TableRow,
  TableColumn,
  TableHeadColumn
} from "components/DataTable/Elements";
import { AddRowButton } from "components/DataTable/Controls";
import IconText from "components/IconText";
import Icon from "components/DataTable/icon-plus.svg?inline";
import Row from "components/MetadataTable/Row";

const getUsedKeys = fp.flow(
  fp.filter("key"),
  fp.map("key")
);

const MetadataTable = ({
  questionnaireId,
  metadata,
  onAdd,
  onDelete,
  onUpdate
}) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableHeadColumn width="20%">Key</TableHeadColumn>
        <TableHeadColumn width="20%">Alias</TableHeadColumn>
        <TableHeadColumn width="15%">Type</TableHeadColumn>
        <TableHeadColumn width="45%">Value</TableHeadColumn>
        <TableHeadColumn width="34px" />
      </TableRow>
    </TableHead>
    <TableBody>
      <React.Fragment>
        {map(metadata, row => (
          <Row
            key={row.id}
            metadata={row}
            onDelete={onDelete}
            onUpdate={onUpdate}
            questionnaireId={questionnaireId}
            usedKeys={getUsedKeys(metadata)}
          />
        ))}
      </React.Fragment>
    </TableBody>
    <TableFoot>
      <TableRow>
        <TableColumn colSpan="5">
          <AddRowButton
            data-test="metadata-add-row"
            onClick={() => onAdd(questionnaireId)}
            variant="tertiary"
            small
          >
            <IconText icon={Icon} dark>
              Add metadata
            </IconText>
          </AddRowButton>
        </TableColumn>
      </TableRow>
    </TableFoot>
  </Table>
);

MetadataTable.propTypes = {
  metadata: PropTypes.arrayOf(CustomPropTypes.metadata).isRequired,
  questionnaireId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default MetadataTable;
