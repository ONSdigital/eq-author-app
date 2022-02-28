import PropTypes from "prop-types";
import styled from "styled-components";

const Grid = styled.div.attrs(() => ({ "data-test": "grid" }))`
  display: flex;
  width: 100%;
  height: 100%;

  flex: ${({ fillHeight }) => (fillHeight ? 1 : 0)} 1 auto;
  flex-direction: row;
  align-items: ${({ align }) => alignOptions[align]};
  justify-content: ${({ horizontalAlign }) =>
    horizontalAlignOptions[horizontalAlign]};
`;

const alignOptions = {
  center: "center",
  top: "stretch",
  bottom: "flex-end",
};

const horizontalAlignOptions = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  spaceBetween: "space-between",
};

Grid.propTypes = {
  align: PropTypes.oneOf(Object.keys(alignOptions)),
  children: PropTypes.node.isRequired,
  fillHeight: PropTypes.bool,
  horizontalAlign: PropTypes.oneOf(Object.keys(horizontalAlignOptions)),
};

Grid.defaultProps = {
  align: "top",
  fillHeight: true,
  horizontalAlign: "start",
};

export default Grid;
