import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./tableHead";
import TableBody from "./tableBody";

const TableWrapper = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
`;

const QuestionnaireTable = ({ questionnaires, enabledHeadings }) => {
  return (
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
  );
};
export default QuestionnaireTable;
