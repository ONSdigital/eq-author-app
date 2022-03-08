import React from "react";
import styled from "styled-components";
import PropType from "prop-types";

import { colors } from "constants/theme";

const CommentNotification = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.neonYellow};
  padding: 1rem;
  position: relative;
  &::before {
    border-bottom: 15px solid transparent;
    border-left: 15px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 15px solid transparent;
    border-top: 15px solid ${({ theme }) => theme.colors.neonYellow};
    bottom: -30px;
    content: "";
    height: 0;
    left: 17px;
    position: absolute;
    width: 0;
  }
  /* &::after {
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
  } */
`;

// const Feedback = () => {
//   return <CommentNotificationContainer />;
// };

// Feedback.propTypes = {
//   children: PropType.node,
// };

export default CommentNotification;
