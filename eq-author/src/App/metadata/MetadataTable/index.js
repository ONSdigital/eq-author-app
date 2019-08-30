import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { map } from "lodash";
import fp from "lodash/fp";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadColumn,
} from "components/datatable/Elements";

import Row from "./Row";

const getUsedKeys = fp.flow(
  fp.filter("key"),
  fp.map("key")
);

const MetadataTable = ({ questionnaireId, metadata, onDelete, onUpdate }) => (
  <Table data-test="metadata-table">
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
  </Table>
);

MetadataTable.propTypes = {
  metadata: PropTypes.arrayOf(CustomPropTypes.metadata).isRequired,
  questionnaireId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default MetadataTable;
