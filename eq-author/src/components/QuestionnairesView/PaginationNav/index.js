import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Pagination from "./PaginationNav";

const Result = styled.div`
  display: flex;
  padding-top: 0.3em !important;
  list-style-type: none;
  color: #000;
  align-items: left;
  justify-content: left;
  margin-top: 0.5em;
`;

const PaginationNavTable = ({
  pageCount,
  currentPageIndex,
  onPageChange,
  totalCount,
}) => (
  <>
    <Result data-test="pages">
      {`Page ${currentPageIndex + 1} of ${pageCount}`}
    </Result>
    <Pagination
      currentPageIndex={currentPageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
      totalCount={totalCount}
    />
  </>
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
