import styled from "styled-components";

const Input = styled.input.attrs({ disabled: true })`
  padding: 0.6em;
  display: block;
  color: inherit;
  font-size: 1em;
  border: 1px solid #999;
  border-radius: 3px;
  transition: border-color 0.2s ease-in;
  width: 100%;
`;

export default Input;
