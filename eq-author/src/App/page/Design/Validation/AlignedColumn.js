import { Column } from "components/Grid";
import styled from "styled-components";

const AlignedColumn = styled(Column)`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  height: 100%;
`;

export default AlignedColumn;
