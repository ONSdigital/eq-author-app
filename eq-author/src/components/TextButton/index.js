import styled from "styled-components";
import Button from "components/Button";

const TextButton = styled(Button).attrs({
  variant: "tertiary"
})`
  padding: 0.25em 0.5em;
  letter-spacing: 0.05em;
  font-size: 0.9em;
  font-weight: bold;
`;

export default TextButton;
