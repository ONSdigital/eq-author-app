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

const index = (currentPageIndex, pageCount) => {
  pageCount === 0 ? (currentPageIndex = 0) : (currentPageIndex += 1);
  return currentPageIndex;
};

const PaginationNavTable = ({ pageCount, currentPageIndex, onPageChange }) => (
  <>
    <Result data-test="pages">
      {`Page ${index(currentPageIndex, pageCount)} of ${pageCount}`}
    </Result>
    <Pagination
      currentPageIndex={currentPageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  </>
);
PaginationNavTable.propTypes = {
  pageCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PaginationNavTable;
