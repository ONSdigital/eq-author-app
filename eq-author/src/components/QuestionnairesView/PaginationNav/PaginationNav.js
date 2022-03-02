import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Theme from "contexts/themeContext";
import Button from "components-themed/buttons/button.js";
import { colors } from "constants/theme";

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
        {pageNumbers().map((key, index) => {
          if (key === "...") {
            return <DotsItems>...</DotsItems>;
          } else {
            return (
              <PaginationButton
                key={index}
                selected={key === currentPageIndex}
                onClick={() => onPageChange(key)}
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
