import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./tableHead";
import TableBody from "./tableBody";
import Panel from "components/Panel";
import { colors } from "constants/theme";

const Border = styled(Panel)`
  border: 1px solid ${colors.black};
`;
const TableWrapper = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
  /* border: 0.01em solid black; */
  border-radius: 1em;
  border-top-left-radius: 1em;
`;

const QuestionnaireTable = ({ questionnaires, enabledHeadings }) => {
  return (
    <Border>
      <TableWrapper>
        <TableHead
          //   onSortClick={onSortClick}
          //   onReverseClick={onReverseClick}
          //   sortOrder={sortOrder}
          //   currentSortColumn={currentSortColumn}
          enabledHeadings={enabledHeadings}
          //   sticky={variant === "selectModal"}
        />
        <TableBody
          questionnaires={questionnaires}
          enabledHeadings={enabledHeadings}
        />
      </TableWrapper>
    </Border>
  );
};
export default QuestionnaireTable;
