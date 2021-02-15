import styled from "styled-components";

import { colors } from "constants/theme";
import Label from "components/Forms/Label";
import Button from "components/buttons/Button";
import ButtonGroup from "components/buttons/ButtonGroup";

import svgPath from "./path.svg";
import svgPathEnd from "./path-end.svg";

export const StyledLabel = styled(Label)`
  width: 100%;
  text-align: center;
`;

export const ConnectedPath = styled.div`
  position: relative;
  height: 100%;

  &::after {
    position: absolute;
    content: "";
    background: url(${({ pathEnd }) => (pathEnd ? svgPathEnd : svgPath)})
      no-repeat center center;
    background-size: auto;
    width: 100%;
    height: calc(100% - 2em);
    top: 0;
    bottom: 0;
    margin: auto;
  }
`;

export const ActionButtons = styled(ButtonGroup)`
  align-items: center;
  justify-content: center;
`;

export const ActionButton = styled(Button)`
  width: 1.1em;
  height: 1.1em;
  border-radius: 100px;
  margin-right: 0.5em !important;
  svg {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;

export const RemoveButton = styled(ActionButton)`
  &:hover {
    background: ${colors.red};
  }
`;

export const AddButton = styled(ActionButton)`
  &:hover {
    background: ${colors.green};
  }
`;
