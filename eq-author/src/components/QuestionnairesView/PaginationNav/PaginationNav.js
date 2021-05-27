import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Button from "components/buttons/Button";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";

import iconArrow from "./icon-arrow.svg";

const PaginationButton = styled(Button).attrs({ variant: "secondary" })`
  font-size: 0.8em;
  padding: 0.6em 1.4em;
  border: 1px solid ${colors.bordersLight};
  margin: 0;

  &::before {
    content: "";
    width: 1em;
    height: 1em;
    display: block;
    background: url(${iconArrow}) no-repeat center;
  }

  &[disabled] {
    opacity: 1;
    &::before {
      opacity: 0.5;
    }
  }

  &:hover {
    background: ${colors.lighterGrey};
    border-color: ${colors.borders};
  }
`;

const PrevButton = styled(PaginationButton)`
  border-radius: 4px 0 0 4px;
`;

const NextButton = styled(PaginationButton)`
  border-radius: 0 4px 4px 0;
  &::before {
    transform: scaleX(-1);
  }
`;

const Pages = styled.div`
  background: white;
  border: 1px solid ${colors.bordersLight};
  border-left: none;
  border-right: none;
  line-height: 1;
  font-size: 0.9em;
  padding: 0 1.5em;
  display: flex;
  align-items: center;
  color: #666;
`;

const Nav = styled.nav`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  text-align: center;
`;

const Pagination = ({ currentPageIndex, pageCount, onPageChange }) => {
  return (
    <Nav aria-label="Questionnaires navigation">
      <PrevButton
        disabled={currentPageIndex === 0}
        onClick={() => onPageChange(currentPageIndex - 1)}
        data-test="prev-page-btn"
      >
        <VisuallyHidden>Go to previous page</VisuallyHidden>
      </PrevButton>

      <Pages>
        {currentPageIndex + 1} of {pageCount || 1}
      </Pages>

      <NextButton
        disabled={currentPageIndex === pageCount - 1}
        onClick={() => onPageChange(currentPageIndex + 1)}
        data-test="next-page-btn"
      >
        <VisuallyHidden>Go to next page</VisuallyHidden>
      </NextButton>
    </Nav>
  );
};

Pagination.propTypes = {
  currentPageIndex: PropTypes.number.isRequired,
  pageCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
