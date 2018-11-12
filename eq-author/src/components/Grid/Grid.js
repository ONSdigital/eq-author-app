import PropTypes from "prop-types";
import styled from "styled-components";

const Grid = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex: ${({ fillHeight }) => (fillHeight ? 1 : 0)} 1 auto;
  flex-direction: row;
  align-items: ${({ align }) => alignOptions[align]};
`;

const alignOptions = {
  center: "center",
  top: "stretch",
  bottom: "flex-end"
};

Grid.propTypes = {
  align: PropTypes.oneOf(Object.keys(alignOptions)),
  children: PropTypes.node.isRequired,
  fillHeight: PropTypes.bool
};

Grid.defaultProps = {
  align: "top",
  fillHeight: true
};

export default Grid;
