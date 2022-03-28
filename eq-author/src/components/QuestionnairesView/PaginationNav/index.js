import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import PaginationNav from "./PaginationNav";

const Wrapper = styled.div`
  display: flex;
  padding: 1em 0;
  align-items: center;
`;

const Results = styled.div`
  color: ${colors.textLight};
  font-size: 0.9em;
  position: absolute;

  ${({ padding }) =>
    padding === "small" &&
    `
    margin-left: 1em;
  `}
`;

const PaginationNavTable = ({
  countOnPage,
  totalCount,
  pageCount,
  currentPageIndex,
  onPageChange,
  padding,
}) => (
  <Wrapper>
    <Results padding={padding}>
      Showing {countOnPage} of {totalCount}
    </Results>
    <PaginationNav
      currentPageIndex={currentPageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  </Wrapper>
);

PaginationNavTable.propTypes = {
  countOnPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  padding: PropTypes.string,
};

export default PaginationNavTable;
