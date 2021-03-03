import styled from "styled-components";
import PropTypes from "prop-types";

const numCols = 12;
const colWidth = (num) => `${(num / numCols) * 100}%`;

const Column = styled.div.attrs(() => ({ "data-test": "column" }))`
  flex: 1 1 auto;
  padding: ${({ gutters }) => (gutters !== false ? "0 0.5em" : "0")};
  max-width: ${({ cols }) => colWidth(cols)};
  margin-left: ${({ offset }) => (offset ? colWidth(offset) : "0")};

  &:first-child {
    padding-left: 0;
  }

  &:last-child:not(:only-child) {
    padding-right: 0;
  }
`;

Column.propTypes = {
  cols: PropTypes.number,
  gutters: PropTypes.bool,
  offset: PropTypes.number,
};

Column.defaultProps = {
  cols: numCols,
};

export default Column;
