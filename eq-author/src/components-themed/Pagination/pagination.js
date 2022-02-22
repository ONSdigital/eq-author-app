import { React } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Theme } from "../../../../eq-author-api/schema/resolvers/base";
import Button from "../buttons/button";
import { colors } from "constants/theme";

//Create component here

const container = styled.ul`
  display: flex;
  list-style-type: none;
`;

const paginationItem = styled.li`
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
`;

const PaginationButton = styled(Button).attrs({ variant: "ghost-white" })`
  font-size: 0.8em;
  padding: 0.6em 1.4em;
  margin: 0;

  &::before {
    content: "";
    width: 1em;
    height: 1em;
    display: block;
  }

  &[disabled] {
    opacity: 1;
    &::before {
      opacity: 0.5;
    }
  }

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
  totalCount,
  onPageChange,
  siblingCount = 2,
}) => {
  const firstPage = 1;
  const lastPage = totalCount;

  const range = (from, to) => {
    const pagesArray = [];
    for (let i = from; i <= to; i++) {
      pagesArray.push(i);
    }
    return range;
  };

  const pageNumbers = () => {
    const totalNumbers = siblingCount + 5;

    if (totalNumbers >= totalCount) {
      return range(1, totalCount);
    }

    const firstLeftPage = Math.max(currentPageIndex - siblingCount, 1); //left most number of middle range or start
    const lastRightPage = Math.min(totalCount, currentPageIndex - siblingCount); //right most number of middle range or end

    const hasLeftSide = firstLeftPage > 2;
    const hasRightSide = totalCount - lastRightPage > 1;

    //all numbers in the nav
    const totalItems = siblingCount * 2 + 3;

    switch (true) {
      case hasLeftSide && !hasRightSide: {
        //1 ... 5, 6, 7, 8, 9, 10
        const rightRange = range(totalCount - totalNumbers + 1, totalCount);
        return [firstPage, "...", rightRange];
      }
      case !hasLeftSide && hasRightSide: {
        //1, 2, 3, 4, 5, 6 ... 10
        const leftRange = range(1, totalItems);
        return [leftRange, "...", lastPage];
      }
      case hasLeftSide && hasRightSide:
      default: {
        //1 ... 15, 16, 17, 18, 19 ... 35
        const middleRange = range(firstLeftPage, lastRightPage);
        return [firstPage, "...", middleRange, "...", lastPage];
      }
    }
  };

  return (
    // styled ul and li goes here
    <Theme themeName={"ons"}>
      <container>
        <paginationItem>
          <PrevButton variant="ghost-white" data-test="prev-page-btn" noBorders>
            Previous
          </PrevButton>
        </paginationItem>

        {/* map function over the current list exlcuding first and last page*/}

        {/* {renderPagesList} */}

        {pageNumbers.map()}

        <paginationItem>
          <NextButton variant="ghost-white" data-test="next-page-btn" noBorders>
            Next
          </NextButton>
        </paginationItem>
      </container>
    </Theme>
  );
};

Pagination.propTypes = {
  totalCount: PropTypes.number.isRequired,
  currentPageIndex: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number.isRequired,
};

export default Pagination;
