import styled from "styled-components";

import { UncontrolledInput } from "components/Forms/Input";

import { colors } from "constants/theme";

const DataTableTypeaheadInput = styled(UncontrolledInput)`
  outline: none;
  border: none;
  &:focus,
  &:focus-within {
    outline: 3px solid ${colors.tertiary};
    box-shadow: none;
  }
`;

export default DataTableTypeaheadInput;
