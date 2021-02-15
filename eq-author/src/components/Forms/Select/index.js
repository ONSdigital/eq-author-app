import styled, { css } from "styled-components";

import Icon from "assets/icon-select.svg";
import loader from "assets/loader.svg";
import { sharedStyles } from "components/Forms/css";
import { colors } from "constants/theme";
import withChangeHandler from "components/Forms/withChangeHandler";

const loading = css`
  background: white url("${loader}") no-repeat right 0.4em center;
  background-size: 20px;
  pointer-events: none;
  opacity: 0.8;
`;

export const SimpleSelect = styled.select`
  ${sharedStyles};
  display: inline-block;
  padding: 0.5em 2em 0.5em 0.75em;
  background: white url("${Icon}") no-repeat right center;
  appearance: none;
  position: relative;
  transition: opacity 100ms ease-in-out;
  border-radius: 4px;
  border: ${({ hasError }) =>
    hasError ? `2px solid ${colors.red}` : `thin solid ${colors.grey}`};

  line-height: 1.2;

  &:hover {
    outline: none;
  }

  &[disabled] {
    opacity: 0.5;
    pointer-events: none;
  }

  ${(props) => props.loading && loading}
`;

export default withChangeHandler(SimpleSelect);
