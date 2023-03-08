import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import { AddRowButton } from "components/datatable/Controls";
import IconText from "components/IconText";
import Icon from "components/datatable/icon-plus.svg?inline";
import { Label } from "components/Forms";
import { colors } from "constants/theme";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableFoot,
  TableColumn,
  TableHeadColumn,
} from "components/datatable/Elements";

import Row from "./Row";

const StyledLabel = styled(Label)`
  line-height: normal;
  vertical-align: baseline;
  margin-bottom: 0;
  color: ${colors.darkGrey};
`;

const SampleFileDataTable = ({
  questionnaireId,
  metadata,
  onDelete,
  onUpdate,
  onAdd,
}) => {
  const keyData = metadata.filter(({ key }) => key);
  const usedKeys = keyData.map(({ key }) => key);

  return (
    <Table data-test="sample-file-data-table">
      <TableHead>
        <TableRow>
          <TableHeadColumn width="15%">Key</TableHeadColumn>
          <TableHeadColumn width="15%">
            <StyledLabel htmlFor={"sample-file-data-alias-column"}>
              Alias
            </StyledLabel>
          </TableHeadColumn>
          <TableHeadColumn width="15%">Type</TableHeadColumn>
          <TableHeadColumn width="40%">
            <StyledLabel htmlFor={"sample-file-data-value-column"}>
              Value
            </StyledLabel>
          </TableHeadColumn>
          <TableHeadColumn width="15%">Fallback</TableHeadColumn>
          <TableHeadColumn width="34px" />
        </TableRow>
      </TableHead>
      <TableBody>
        {metadata.map((row) => (
          <Row
            key={row.id}
            metadata={row}
            onDelete={onDelete}
            onUpdate={onUpdate}
            questionnaireId={questionnaireId}
            usedKeys={usedKeys}
            keyData={keyData}
          />
        ))}
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableColumn colSpan="6">
            <AddRowButton
              data-test="sample-file-data-add-row"
              onClick={() => onAdd(questionnaireId)}
              variant="tertiary"
              small
            >
              <IconText icon={Icon} dark>
                Add sample file data
              </IconText>
            </AddRowButton>
          </TableColumn>
        </TableRow>
      </TableFoot>
    </Table>
  );
};

SampleFileDataTable.propTypes = {
  metadata: PropTypes.arrayOf(CustomPropTypes.metadata).isRequired,
  questionnaireId: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default SampleFileDataTable;
