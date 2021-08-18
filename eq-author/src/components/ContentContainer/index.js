import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const Wrapper = styled.div`
  margin: 0 2em 1em;
  border: 1px solid ${colors.grey};
`;

const Header = styled.div`
  margin-left: 0;
  height: 100%;
  width: 100%;
  background-color: ${colors.primary};
`;

export const Title = styled.h2`
  vertical-align: middle;
  text-align: left;
  margin: 0;
  padding: 0;
  font-size: inherit;
`;

export const Body = styled.div`
  display: block;
  margin-top: 0;
  margin-left: 0;
  padding: 1em 0 1em 0.5em;
  border-left: none;
`;

export const HeaderText = styled.div`
  border: none;
  font-size: 1em;
  font-weight: bold;
  margin: 0;
  padding: 0.25em 0.25em 0.25em 0;
  display: flex;
  align-items: center;
  position: relative;
  background: transparent;
  color: ${colors.white};
  text-decoration: none;
  margin-left: 0.5em;

  &::before {
    content: "";
    width: 0.5em;
    height: 1.5em;
    margin-top: 0.2em;
  }
`;

const ContentContainer = ({ title, children }) => {
  return (
    <Wrapper data-test="collapsible">
      <Header className="content-header" data-test="content-header">
        <Title className="content-title" data-test="content-title">
          <HeaderText>{title}</HeaderText>
        </Title>
      </Header>
      <Body className="collapsible-body" data-test="collapsible-body" isOpen>
        {children}
      </Body>
    </Wrapper>
  );
};

ContentContainer.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ContentContainer;
