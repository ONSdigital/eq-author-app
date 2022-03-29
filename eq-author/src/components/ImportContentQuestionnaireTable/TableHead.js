import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors, radius } from "constants/theme";
import Button from "components/buttons/Button";

import iconArrow from "assets/icon-arrow-down.svg";

import { SORT_ORDER } from "constants/sort-order";
import tableHeadings from "./TableHeadings";

const Thead = styled.thead`
  background-color: ${colors.white};

  ${({ sticky }) =>
    sticky &&
    `
      position: sticky;
      top: 0;
      z-index: 99;

      button {
        opacity: 1;
        background-color: ${colors.white};
      }
    
  `}
`;

const TH = styled.th`
  color: ${colors.darkGrey};
  width: ${(props) => props.colWidth};
  border-bottom: 1px solid #e2e2e2;
  font-weight: normal;
  font-size: 0.9em;

  &:first-child > * {
    border-radius: ${radius} 0 0;
    padding-left: 1em;
  }
`;

TH.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

const SortButton = styled(Button)`
  display: block;
  cursor: pointer;
  opacity: 0.8;
  padding: 0.5em;
  background-color: transparent;
  color: inherit;
  font-weight: normal;
  width: 100%;
  text-align: left;
  border-radius: 0;

  &::after {
    content: url(${iconArrow});
    display: inline-block;
    width: 16px;
    height: 16px;
    opacity: ${(props) => (props.active ? "0.8" : "0.2")};
    transform: rotate(
      ${(props) => (props.order === SORT_ORDER.ASCENDING ? "180deg" : "0deg")}
    );
    transition: transform 150ms ease-out;
    position: relative;
    top: 3px;
  }

  &:hover {
    opacity: 1;
  }

  &:focus {
    z-index: 1;
  }
`;

SortButton.propTypes = {
  active: PropTypes.bool.isRequired,
  order: PropTypes.oneOf([SORT_ORDER.ASCENDING, SORT_ORDER.DESCENDING])
    .isRequired,
};

const SortableTH = ({
  children,
  sortOrder,
  sortColumn,
  onSortClick,
  onReverseClick,
  colWidth,
  currentSortColumn,
  dataTest,
}) => {
  const active = sortColumn === currentSortColumn;
  return (
    <TH aria-sort={active ? sortOrder : "none"} colWidth={colWidth}>
      <SortButton
        active={active}
        order={active ? sortOrder : SORT_ORDER.DESCENDING}
        role="button"
        onClick={() => (active ? onReverseClick() : onSortClick(sortColumn))}
        data-test={dataTest}
      >
        {children}
      </SortButton>
    </TH>
  );
};

SortableTH.propTypes = {
  onSortClick: PropTypes.func.isRequired,
  onReverseClick: PropTypes.func.isRequired,
  colWidth: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
  sortColumn: PropTypes.string,
  sortOrder: PropTypes.string,
  currentSortColumn: PropTypes.string,
  dataTest: PropTypes.string,
};

const UnsortableTH = styled(TH)`
  padding: 1em;
`;

const renderHeading = (props, { heading, sortColumn, colWidth, sortable }) =>
  sortable ? (
    <SortableTH
      key={`sortable-${heading.toLowerCase()}`}
      sortColumn={sortColumn}
      colWidth={colWidth}
      dataTest={`${heading.toLowerCase()}-sort-button`}
      {...props}
    >
      {heading}
    </SortableTH>
  ) : (
    <UnsortableTH
      key={`unsortable-${heading.toLowerCase()}`}
      colWidth={colWidth}
    >
      {heading}
    </UnsortableTH>
  );
const TableHead = (props) => {
  const { enabledHeadings, sticky } = props;

  const filteredHeadings = tableHeadings.filter(({ heading }) =>
    enabledHeadings.includes(heading)
  );

  return (
    <Thead sticky={sticky}>
      <tr>
        {filteredHeadings.map((heading) => renderHeading(props, heading))}
      </tr>
    </Thead>
  );
};

TableHead.propTypes = {
  onSortClick: PropTypes.func,
  onReverseClick: PropTypes.func,
  sortOrder: PropTypes.string,
  sortColumn: PropTypes.string,
  enabledHeadings: PropTypes.array.isRequired, // eslint-disable-line
  sticky: PropTypes.bool,
};

export default TableHead;
