import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import Item from "../Item";

const OrderedList = styled.ol`
  padding: 0;
  margin: 0;
`;

const List = ({ children, className }) => {
  return <OrderedList className={className}>{children}</OrderedList>;
};

export default List;
