import styled from "styled-components";
import Button from "../Button";
import { radius } from "constants/theme";

const PrimaryButton = styled(Button).attrs({
  variant: "secondary"
})`
  border-radius: ${radius} 0 0 ${radius};
  border-right: 0;
  flex: 1;
  position: relative;
  z-index: 2;
`;

export default PrimaryButton;
