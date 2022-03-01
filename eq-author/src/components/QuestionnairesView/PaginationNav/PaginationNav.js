import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Theme from "contexts/themeContext";
import Button from "components-themed/buttons/button.js";
import colors from "constants/theme";

const Container = styled.div`
  display: flex;
  padding-top: 0.5em;
  color: #000;
  align-items: left;
  justify-content: left;
  text-align: left;
  margin-top: 0.4em;
  font-size: 1.5em;
  padding: 0em 0em 0em 0em;
`;

const PaginationButton = styled(Button).attrs({ variant: "ghost" })`
  font-size: 0.6em;
  font-weight: normal;
  color: #000;
  border: none;
  text-decoration: underline;
  &:hover {
    background-color: ${colors.darkerBlue};
  }
  &:active {
    color: blue;
    background-color: ${colors.darkerBlue};
  }
  /* span {
    padding: 0em 2em 0em 0em !important;
  } */
`;

const PrevButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
  span {
    padding: 0em 0em 0em 0em;
  }
`;

const NextButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
`;

const Pagination = ({
  currentPageIndex,
  onPageChange,
  siblingCount = 2,
  pageCount,
}) => {
  //last page is not total count
  const firstPage = 1;
  const lastPage = pageCount;

  const range = (from, to) => {
    const pagesArray = [];
    for (let i = from; i <= to; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  };

  const pageNumbers = () => {
    const firstLeftPage = Math.max(currentPageIndex - siblingCount, 1); //left most number of middle range or start
    const lastRightPage = Math.min(pageCount, currentPageIndex + siblingCount); //right most number of middle range or end

    const hasLeftSide = firstLeftPage > 2;
    const hasRightSide = pageCount - lastRightPage > 1;

    //all numbers in the nav
    const totalItems = 3 + 2 * siblingCount;

    switch (true) {
      case totalItems >= pageCount: {
        return range(1, pageCount);
      }
      case hasLeftSide && !hasRightSide: {
        //1 ... 5, 6, 7, 8, 9, 10
        // 3,  7
        // console.log("totalCount, totalNumbers :>> ", pageCount, totalNumbers);
        let rightRange = range(pageCount - totalItems + 1, pageCount);
        // let rightRange = range(firstLeftPage, lastRightPage);
        return [firstPage, "...", ...rightRange];
      }
      case !hasLeftSide && hasRightSide: {
        //1, 2, 3, 4, 5, 6 ... 10
        let leftRange = range(1, totalItems);
        return [...leftRange, "...", lastPage];
      }
      case hasLeftSide && hasRightSide:
      default: {
        //1 ... 15, 16, 17, 18, 19 ... 35
        let middleRange = range(firstLeftPage, lastRightPage);
        return [firstPage, "...", ...middleRange, "...", lastPage];
      }
    }
  };
  const pages = pageNumbers();

  return (
    <Theme themeName={"ons"}>
      <Container>
        <PrevButton
          variant="ghost-white"
          data-test="prev-page-btn"
          noBorders
          disabled={currentPageIndex === 1}
          onClick={() => onPageChange(currentPageIndex - 1)}
        >
          Previous
        </PrevButton>
        {pages.map((key, index) => {
          return (
            <PaginationButton
              key={index}
              selected={key === currentPageIndex}
              onClick={() => onPageChange(key)}
              value={key}
            >
              {key}
            </PaginationButton>
          );
        })}
        <NextButton
          variant="ghost-white"
          data-test="next-page-btn"
          noBorders
          disabled={currentPageIndex === lastPage}
          onClick={() => onPageChange(currentPageIndex + 1)}
        >
          Next
        </NextButton>
      </Container>
    </Theme>
  );
};

Pagination.propTypes = {
  pageCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number.isRequired,
};

export default Pagination;
