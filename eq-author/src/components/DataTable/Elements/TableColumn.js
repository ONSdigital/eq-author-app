import styled from "styled-components";

import { colors } from "constants/theme";

const TableColumn = styled.td`
  padding: 0;
  position: relative;
  :not(:last-of-type) {
    border-right: 1px solid ${colors.bordersLight};
  }
`;

export default TableColumn;
