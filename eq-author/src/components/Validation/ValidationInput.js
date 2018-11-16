import React from "react";
import { Input } from "components/Forms";
import styled from "styled-components";

const Context = styled.div`
  position: relative;
  width: 10em;
`;

const Unit = styled.span`
  position: absolute;
  right: -2em;
  text-align: right;
  top: 0;
  bottom: 0;
  height: 1em;
  line-height: 1;
  margin: auto;
  font-weight: bold;
`;

/*  eslint-disable react/no-danger */
const ValidationInput = ({ unit, ...otherProps }) => (
  <Context>
    <Input {...otherProps} />
    {unit && <Unit dangerouslySetInnerHTML={{ __html: unit }} />}
  </Context>
);

export default ValidationInput;
