import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Input from "components-themed/Input";
import Label from "components-themed/Label";
import { ButtonLink } from "components-themed/Toolkit";

const PasswordContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: ${({ theme }) => theme.radius};
`;

const Password = styled(Input)`
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  min-width: 292px;
`;

const ShowHidePassword = styled.span`
  border: 1px solid ${({ theme }) => theme.colors.input};
  border-left: none;
  border-radius: ${({ theme }) => theme.radius};
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

const PasswordButtonLink = styled(ButtonLink)`
  display: block;
  margin: 0.2rem 1.25rem 0;
`;

const PasswordInput = ({ id, dataTest, ...otherProps }) => {
  const [hidden, setHidden] = useState(true);

  function handlePasswordToggle(e) {
    e.preventDefault();
    setHidden(!hidden);
  }

  return (
    <>
      <Label htmlFor={id}>Password</Label>
      <PasswordContainer>
        <Password
          type={hidden ? "password" : "text"}
          id={id}
          data-test={dataTest}
          {...otherProps}
        />
        <ShowHidePassword>
          <PasswordButtonLink onClick={handlePasswordToggle}>
            {hidden ? "Show" : "Hide"}
          </PasswordButtonLink>
        </ShowHidePassword>
      </PasswordContainer>
    </>
  );
};

PasswordInput.propTypes = {
  id: PropTypes.string,
  dataTest: PropTypes.string,
};

export default PasswordInput;
