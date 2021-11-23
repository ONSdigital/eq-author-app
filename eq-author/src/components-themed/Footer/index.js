import React from "react";
import styled from "styled-components";

import logo from "assets/ons-logo.svg";

const DefaultFooter = styled.div`
  background-color: ${({ theme }) => theme.colors.textBannerLink};
  padding: 2rem 0 4rem 1rem;
`;

const Footer = () => {
  return (
    <DefaultFooter>
      <img src={logo} alt="Office for National Statistics logo" />
    </DefaultFooter>
  );
};

export default Footer;
