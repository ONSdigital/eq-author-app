import React from "react";
import PropTypes from "prop-types";

import Pagination from "./PaginationNav";

const PaginationNavTable = ({
  pageCount,
  currentPageIndex,
  onPageChange,
  totalCount,
  siblingCount = 2,
}) => (
  <Pagination
    currentPageIndex={currentPageIndex}
    pageCount={pageCount}
    onPageChange={onPageChange}
    totalCount={totalCount}
    siblingCount={siblingCount}
  />
);
PaginationNavTable.propTypes = {
  countOnPage: PropTypes.number.isRequired,
  siblingCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  padding: PropTypes.string,
};

export default PaginationNavTable;
