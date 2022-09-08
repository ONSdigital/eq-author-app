import React from "react";
import styled from "styled-components";

import { colors } from "constants/theme";
import IconText from "components/IconText";
import WarningIcon from "./icon-warning.svg?inline";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 6em;
  display: flex;
`;

const WarningMessage = styled(IconText)`
  display: flex;
  color: ${colors.white};
  padding: 1em;
  margin-bottom: 3em;
  font-weight: bold;
  width: 20em;
  font-size: 1.1em;
`;

const BannerMessageContainer = styled.div`
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100em;
  font-weight: bold;
  font-size: 0.9em;
  margin-top: 0.7em;
`;

const Content = styled.div`
  line-height: 1.7em;
`;

const Link = styled.a`
  color: ${colors.white};
`;

const WarningBanner = () => {
  return (
    <Banner>
      <WarningMessage icon={WarningIcon}>Action required</WarningMessage>
      <BannerMessageContainer>
        <Content>
          Author has migrated and this page will be turned off shortly.
        </Content>
        <Content>
          Please use latest version of Author:&nbsp;
          <Link href="https://author.eqbs.gcp.onsdigital.uk/">
            https://author.eqbs.gcp.onsdigital.uk/
          </Link>
        </Content>
        <Content>
          If you have any questions please contact the Author team at&nbsp;
          <Link href="mailto:Author.Requests@ons.gov.uk">
            Author.Requests@ons.gov.uk
          </Link>
        </Content>
      </BannerMessageContainer>
    </Banner>
  );
};

export default WarningBanner;
