import styled from "styled-components";

import { TextArea } from "components/Forms";

import { colors } from "constants/theme";

const TableTextArea = styled(TextArea)`
  border-radius: 0;
  border-color: transparent;
  &:focus,
  &:focus-within {
    outline: 3px solid ${colors.tertiary};
    box-shadow: none;
  }
`;

export default TableTextArea;
