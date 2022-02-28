import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Pagination from "./PaginationNav";

const wrapper = styled.div`
  display: flex;
  list-style-type: none;
  color: #000;
  align-items: center;
  justify-content: center;
`;

const PaginationNavTable = ({
  pageCount,
  currentPageIndex,
  onPageChange,
  totalCount,
}) => (
  <>
    <wrapper>
      Page {currentPageIndex} of {pageCount}
    </wrapper>
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

// import React from "react";
// import styled from "styled-components";
// import PropTypes from "prop-types";

// import { colors } from "constants/theme";

// import PaginationNav from "./PaginationNav";

// const Wrapper = styled.div`
//   display: flex;
//   padding-top: 1em;
//   align-items: center;
// `;

// const Results = styled.div`
//   color: ${colors.textLight};
//   font-size: 0.9em;
//   position: absolute;

//   ${({ padding }) =>
//     padding === "small" &&
//     `
//     margin-left: 1em;
//   `}
// `;

// const PaginationNavTable = ({
//   countOnPage,
//   totalCount,
//   pageCount,
//   currentPageIndex,
//   onPageChange,
//   padding,
// }) => (
//   <Wrapper>
//     <Results padding={padding}>
//       Showing {countOnPage} of {totalCount}
//     </Results>
//     <PaginationNav
//       currentPageIndex={currentPageIndex}
//       pageCount={pageCount}
//       onPageChange={onPageChange}
//     />
//   </Wrapper>
// );

// PaginationNavTable.propTypes = {
//   countOnPage: PropTypes.number.isRequired,
//   totalCount: PropTypes.number.isRequired,
//   pageCount: PropTypes.number.isRequired,
//   currentPageIndex: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   padding: PropTypes.string,
// };

// export default PaginationNavTable;
