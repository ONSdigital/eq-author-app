import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import PaginationNav from "./PaginationNav";

const TableFooter = styled.div`
  display: flex;
  padding-top: 1em;
  align-items: center;
`;

const Results = styled.div`
  color: ${colors.textLight};
  font-size: 0.9em;
  position: absolute;
`;

const Footer = ({
  countOnPage,
  totalCount,
  pageCount,
  currentPageIndex,
  onPageChange,
}) => (
  <TableFooter>
    <Results>
      Showing {countOnPage} of {totalCount}
    </Results>
    <PaginationNav
      currentPageIndex={currentPageIndex}
      pageCount={pageCount}
      onPageChange={onPageChange}
    />
  </TableFooter>
);

Footer.propTypes = {
  countOnPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Footer;
