import styled from "styled-components";

import { colors } from "constants/theme";

const TableHeadColumn = styled.th`
  padding: 0.75em 1em;
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersLight};
  }
`;

export default TableHeadColumn;
