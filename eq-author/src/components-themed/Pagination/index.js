import React from "react";
import PropTypes from "prop-types";

import Pagination from "./pagination";

const PaginationNavTable = ({
  pageCount,
  currentPageIndex,
  onPageChange,
  totalCount,
}) => (
  <Pagination
    currentPageIndex={currentPageIndex}
    pageCount={pageCount}
    onPageChange={onPageChange}
    totalCount={totalCount}
  />
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
