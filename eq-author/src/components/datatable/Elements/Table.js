import styled from "styled-components";

import { colors } from "constants/theme";

const Table = styled.table`
  width: 100%;
  font-size: 1em;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: left;
  border: 1px solid ${colors.borders};
`;

export default Table;
