import React from "react";
import styled from "styled-components";
import PropType from "prop-types";

const FeedbackContainer = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.branded};
  margin-bottom: 2rem;
  padding: 1rem;
  position: relative;
  &::before {
    border-bottom: 15px solid transparent;
    border-left: 15px solid ${({ theme }) => theme.colors.branded};
    border-right: 15px solid transparent;
    border-top: 15px solid ${({ theme }) => theme.colors.branded};
    bottom: -30px;
    content: "";
    height: 0;
    left: 17px;
    position: absolute;
    width: 0;
  }
  &::after {
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    border-right: 12px solid transparent;
    border-top: 12px solid #fff;
    bottom: -23px;
    content: "";
    height: 0;
    left: 20px;
    position: absolute;
    width: 0;
  }
`;

const Feedback = ({ children }) => {
  return <FeedbackContainer>{children}</FeedbackContainer>;
};

Feedback.propTypes = {
  children: PropType.node,
};

export default Feedback;
