import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const OrderedList = styled.ol`
  padding: 0;
  margin: 0;
`;

const List = ({ children, className }) => {
  return <OrderedList className={className}>{children}</OrderedList>;
};
List.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default List;
