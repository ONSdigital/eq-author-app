import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Theme from "contexts/themeContext";
import Button from "components-themed/buttons/button.js";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";
import { keysIn } from "lodash";

const Container = styled.div`
  display: flex;
  padding-top: 0.2em;
  justify-content: left;
  text-align: left;
  font-size: 1.5em;
`;

const DotsItems = styled.li`
  display: flex;
  padding: 0.7em 1em 0.8em;
  font-weight: normal;
  font-size: 0.7em;
`;

const PaginationButton = styled(Button).attrs({ variant: "ghost" })`
  font-size: 0.7em;
  font-weight: normal;
  color: ${colors.oceanBlue};
  border: none;
  text-decoration: underline;
  background-color: ${({ selected }) => selected && colors.nightBlue};
  &:focus {
    background-color: unset !important;
    color: ${colors.oceanBlue};
  }
  &:hover {
    color: ${colors.oceanBlue};
  }
  &:active:focus {
    color: ${colors.oceanBlue};
  }
  &:focus:hover:not(:active) {
    color: ${colors.oceanBlue};
  }
`;

const PrevButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
  &:hover,
  &:active {
    background-color: ${colors.darkerBlue};
    color: white;
  }
  span {
    padding: 0.7em 1em 0.8em 0em !important;
    color: ${colors.oceanBlue};
  }
`;

const NextButton = styled(PaginationButton)`
  color: ${colors.oceanBlue};
  text-decoration: underline;
  font-weight: normal;
  &:hover,
  &:active {
    background-color: ${colors.darkerBlue};
    color: white;
  }
`;

const Pagination = ({
  currentPageIndex,
  onPageChange,
  siblingCount = 2,
  pageCount,
  totalCount,
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
    const firstLeftPage = Math.max(currentPageIndex + 1 - siblingCount, 1); //left most number of middle range or start
    const lastRightPage = Math.min(
      pageCount - 1,
      currentPageIndex + 1 + siblingCount
    ); //right most number of middle range or end
    const hasLeftSide = firstLeftPage > 2;
    const hasRightSide = pageCount - lastRightPage > 1;

    //all numbers in the nav
    const totalItems = 3 + 2 * siblingCount;

    switch (true) {
      case totalItems >= pageCount: {
        console.log("case1 :>> ");

        return range(1, pageCount);
      }
      case hasLeftSide && !hasRightSide: {
        //1 ... 5, 6, 7, 8, 9, 10
        // 3,  7
        let rightRange = range(pageCount - totalItems + 1, pageCount);
        console.log("case2 :>> ");

        // let rightRange = range(firstLeftPage, lastRightPage);
        return [firstPage, "...", ...rightRange];
      }
      case !hasLeftSide && hasRightSide: {
        //1, 2, 3, 4, 5, 6 ... 10
        let leftRange = range(1, totalItems);
        console.log("case3 :>> ");

        return [...leftRange, "...", lastPage];
      }
      case hasLeftSide && hasRightSide:
      default: {
        //1 ... 15, 16, 17, 18, 19 ... 35
        let middleRange = range(firstLeftPage, lastRightPage);
        console.log("case4 :>> ", [
          firstPage,
          "...",
          ...middleRange,
          "...",
          lastPage,
        ]);

        return [firstPage, "...", ...middleRange, "...", lastPage];
      }
    }
  };
  console.log("pageNumbers :>> ", pageNumbers());
  console.log("index :>> ", currentPageIndex);

  return (
    <Theme themeName={"ons"}>
      <Container>
        <PrevButton
          variant="ghost-white"
          data-test="prev-page-btn"
          noBorders
          disabled={currentPageIndex === 0}
          onClick={() => onPageChange(currentPageIndex - 1)}
        >
          Previous
          <VisuallyHidden>Go to previous page</VisuallyHidden>
        </PrevButton>

        {pageNumbers().map((key, index) => {
          // console.log('key :>> ', key);
          // console.log('index :>>   ', index);
          if (key === "...") {
            return <DotsItems data-test={`dots-${index}`}>...</DotsItems>;
          } else {
            return (
              <PaginationButton
                key={index}
                selected={key === currentPageIndex + 1}
                onClick={() => onPageChange(key - 1)}
                data-test={`pagination-${key}`}
              >
                {key}
              </PaginationButton>
            );
          }
        })}

        <NextButton
          variant="ghost-white"
          data-test="next-page-btn"
          noBorders
          disabled={currentPageIndex === lastPage - 1}
          onClick={() => onPageChange(currentPageIndex + 1)}
        >
          Next
          <VisuallyHidden>Go to next page</VisuallyHidden>
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
