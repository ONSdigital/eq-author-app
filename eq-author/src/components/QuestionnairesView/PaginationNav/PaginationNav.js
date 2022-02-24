import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Theme from "contexts/themeContext";
import Button from "/Users/omarmoulana/Desktop/repos/eq-author-app/eq-author/src/components-themed/buttons/button.js";
import colors from "constants/theme";

//Create component here

const Container = styled.ul`
  display: flex;
  list-style-type: none;
  color: #000;
  align-items: center;
  justify-content: center;
`;

const PaginationItem = styled.li`
  padding: 0 12px;
  height: 32px;
  text-align: center;
  margin: auto 4px;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  box-sizing: border-box;
  align-items: center;
  letter-spacing: 0.01071em;
  border-radius: 16px;
  line-height: 1.43;
  font-size: 13px;
  min-width: 32px;
  color: #000;
  &:hover {
    background: ${colors.darkerBlue};
  }
  /* text-decoration: underline; */
  &:active {
    color: blue;
  }
`;

const PaginationButton = styled(Button).attrs({ variant: "ghost-white" })`
  font-size: 0.7em;
  /* padding: 0.6em 1.4em; */
  /* margin: 0; */
  color: #000;

  /* &::before {
    content: "";
    width: 1em;
    height: 1em;
    display: block;
  } */

  /* &[disabled] {
    opacity: 1;
    &::before {
      opacity: 0.5;
    }
  } */

  &:hover {
    background: ${colors.darkerBlue};
  }
`;

const PrevButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
`;

const NextButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
`;

const Pagination = ({
  currentPageIndex,
  onPageChange,
  siblingCount = 1,
  pageCount,
}) => {
  //last page is not total count
  const firstPage = 1;
  const lastPage = pageCount;

  const range = (from, to) => {
    console.log("from, to :>> ", from, to);
    const pagesArray = [];
    for (let i = from; i <= to; i++) {
      pagesArray.push(i);
    }
    console.log("pagesArray.toString() :>> ", pagesArray.toString());
    return pagesArray;
  };

  const pageNumbers = () => {
    const totalNumbers = siblingCount + 5;

    // if (totalNumbers >= pageCount) {
    //   return range(1, pageCount);
    // }

    const firstLeftPage = Math.max(currentPageIndex - siblingCount, 1); //left most number of middle range or start
    console.log("firstLeftPage :>> ", firstLeftPage);
    const lastRightPage = Math.min(pageCount, currentPageIndex + siblingCount); //right most number of middle range or end
    console.log("lastRightPage :>> ", lastRightPage);

    const hasLeftSide = firstLeftPage > 2;
    const hasRightSide = pageCount - lastRightPage > 1;

    //all numbers in the nav
    const totalItems = 3 + 2 * siblingCount;

    switch (true) {
      // case totalNumbers >= pageCount: {
      //   let normalRange = range(1, pageCount);
      //   return [normalRange];
      // }
      case hasLeftSide && !hasRightSide: {
        //1 ... 5, 6, 7, 8, 9, 10
        // 3,  7
        console.log("totalCount, totalNumbers :>> ", pageCount, totalNumbers);
        // let rightRange = range(pageCount - totalNumbers + 1, pageCount);
        let rightRange = range(firstLeftPage, lastRightPage);
        console.log("rightRange.toString() :>> ", rightRange.toString());
        return [firstPage, "...", ...rightRange];
      }
      case !hasLeftSide && hasRightSide: {
        //1, 2, 3, 4, 5, 6 ... 10
        let leftRange = range(1, totalItems);
        return [leftRange, "...", lastPage];
      }
      case hasLeftSide && hasRightSide:
      default: {
        //1 ... 15, 16, 17, 18, 19 ... 35
        let middleRange = range(firstLeftPage, lastRightPage);
        return [firstPage, "...", ...middleRange, "...", lastPage];
      }
    }
  };
  return (
    <Theme themeName={"ons"}>
      <Container>
        <PaginationItem>
          <PrevButton
            variant="ghost-white"
            data-test="prev-page-btn"
            noBorders
            disabled={currentPageIndex === 1}
            onClick={() => onPageChange(currentPageIndex - 1)}
          >
            Previous
          </PrevButton>
        </PaginationItem>
        {pageNumbers().map((key) => {
          if (key === "...") {
            return <PaginationItem key={key}>{"\u2026"}</PaginationItem>;
          } else {
            return (
              <PaginationItem
                key={key}
                selected={key === currentPageIndex}
                onClick={() => onPageChange(key)}
              >
                <PaginationButton>{key}</PaginationButton>
              </PaginationItem>
            );
          }
        })}
        <PaginationItem>
          <NextButton
            variant="ghost-white"
            data-test="next-page-btn"
            noBorders
            disabled={currentPageIndex === lastPage}
            onClick={() => onPageChange(currentPageIndex + 1)}
          >
            Next
          </NextButton>
        </PaginationItem>
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
