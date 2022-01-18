import React, { useState } from "react";

import styled from "styled-components";
import Input from "components-themed/Input";

import Label from "components-themed/Label";

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: row;
  border: 1px solid ${({ theme }) => theme.colors.input};
  width: 11.9em;
  border-radius: ${({ theme }) => theme.radius};
`;

const Password = styled(Input)`
  border: none;
  width: 8em;
`;

const ShowHidePassword = styled.span`
  border-left: 1px solid ${({ theme }) => theme.colors.input};
`;

const ShowHideButton = styled.a`
  /* margin: 0 0 1rem; */
  font-size: 1.125rem;
  display: block;
  margin-left: 0.4em;
  margin-top: 0.2em;
`;

const PasswordInput = () => {
  const [password, setPassword] = useState("");

  return (
    <>
      <Label htmlFor="password">Password</Label>
      <PasswordContainer>
        <Password
          // type="password"
          id="password"
          value={password}
          onChange={({ value }) => setPassword(value)}
          // onBlur={() => ()}
          data-test="txt-password"
        />
        <ShowHidePassword>
          <ShowHideButton href="#0">Show</ShowHideButton>
        </ShowHidePassword>
      </PasswordContainer>
    </>
  );
};

export default PasswordInput;
