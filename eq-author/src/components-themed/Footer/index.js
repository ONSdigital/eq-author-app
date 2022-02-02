import React from "react";
import styled from "styled-components";
import PropType from "prop-types";
import { Grid, Column } from "components/Grid";

import logo from "assets/ons-logo.svg";

const DefaultFooter = styled.div`
  background-color: ${({ theme }) => theme.colors.textBannerLink};
  padding: ${({ centerCols }) =>
    centerCols === 9 ? "1.5rem 0 3rem 1rem" : "1.5rem 0 3rem 0"};
`;

const Footer = ({ centerCols }) => {
  return (
    <DefaultFooter>
      <Grid horizontalAlign="center">
        <Column cols={centerCols}>
          <img src={logo} alt="Office for National Statistics logo" />
        </Column>
      </Grid>
    </DefaultFooter>
  );
};

Footer.propTypes = {
  centerCols: PropType.number,
};

Footer.defaultProps = {
  centerCols: 12,
};

export default Footer;
