import styled from "styled-components";

import { colors } from "constants/theme";

const TableRow = styled.tr`
  height: 2.4em;
  :not(:last-of-type) {
    border-bottom: 1px solid ${colors.bordersLight};
  }
`;

export default TableRow;
