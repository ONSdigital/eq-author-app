import styled from "styled-components";

import { Select } from "components/Forms";

import { colors } from "constants/theme";

const DataTableSelect = styled(Select)`
  border-radius: 0;
  border-color: transparent;
  &:hover {
    outline: 1px solid ${colors.blue};
  }
  &:focus,
  &:focus-within {
    outline: 3px solid ${colors.tertiary};
    box-shadow: none;
  }
`;

export default DataTableSelect;
