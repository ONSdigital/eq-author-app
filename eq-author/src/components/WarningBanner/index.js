import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import IconText from "components/IconText";
import WarningIcon from "./icon-warning.svg?inline";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 6em;
  display: flex;
  /* float: left; */
`;

const WarningMessage = styled(IconText)`
  display: flex;
  color: ${colors.white};
  /* animation: ${fade} 750ms ease-in forwards; */
  padding: 1em;
  /* margin-right: 60em; */
  /* margin-bottom: 2em; */
  font-weight: bold;
`;

const BannerMessageContainer = styled.div`
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100em;
`;

const Content = styled.p`
  line-height: 0.1em;
`;

const WarningBanner = ({ bannerMessages, children }) => {
  return (
    <Banner>
      <WarningMessage icon={WarningIcon}>{children}</WarningMessage>
      <BannerMessageContainer>
        {/* <BannerMessage> */}
        <Content>
          Author has been migrated and this page will turn off shortly.
        </Content>
        {/* </BannerMessage> */}
        {/* <BannerMessage> */}
        <Content>Please use latest version of Author.</Content>
        {/* </BannerMessage> */}
        {/* <BannerMessage> */}
        <Content>
          If you have any questions, please contact the Author team.
        </Content>
        {/* </BannerMessage> */}
      </BannerMessageContainer>
    </Banner>
  );
};

export default WarningBanner;
