import styled from "styled-components";

import { colors } from "constants/theme";

const TableHead = styled.thead`
  background-color: ${colors.lightMediumGrey};
  border-bottom: 1px solid ${colors.borders};
  color: ${colors.textLight};
`;

export default TableHead;
