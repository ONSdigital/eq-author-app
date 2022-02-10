import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import TableHead from "./tableHead";

const QuestionnaireTable = ({ enabledHeadings }) => {
  return (
    <TableHead
      //   onSortClick={onSortClick}
      //   onReverseClick={onReverseClick}
      //   sortOrder={sortOrder}
      //   currentSortColumn={currentSortColumn}
      enabledHeadings={enabledHeadings}
      //   sticky={variant === "selectModal"}
    />
  );
};
export default QuestionnaireTable;
