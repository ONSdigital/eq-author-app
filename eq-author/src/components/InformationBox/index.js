import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import warningIcon from "./warning.svg";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  background-color: #d0021b;
  padding: 0.5em 1em;
  &::before {
    content: "";
    background: url(${warningIcon}) no-repeat center;
    width: 18px;
    height: 18px;
    margin-right: 0.5em;
  }
`;

const Content = styled.div`
  background-color: #fbecec;
  padding: 0.75em 1em;
  margin-bottom: 2em;
`;

const InformationBox = ({ headerText, children }) => {
  return (
    <Wrapper>
      <Header>{headerText}</Header>
      <Content>{children}</Content>
    </Wrapper>
  );
};

InformationBox.propTypes = {
  headerText: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default InformationBox;
