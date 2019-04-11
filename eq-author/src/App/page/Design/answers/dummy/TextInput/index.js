import styled from "styled-components";
import { sharedStyles } from "components/Forms/css";

import placeholder from "../placeholder.svg";

const TextInput = styled.div`
  ${sharedStyles};
  border: none;
  background: transparent url(${placeholder}) no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
  padding: 1.2em 1.2em 1.2em 2em;
  position: relative;
  border-radius: 3px;
  z-index: 0;
  overflow: hidden;
`;

export default TextInput;
