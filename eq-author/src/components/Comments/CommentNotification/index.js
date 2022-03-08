import styled, { css } from "styled-components";

const CommentNotificationNavItem = css`
  border-top: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-bottom: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-right: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-left: 5px solid ${({ theme }) => theme.colors.neonYellow};
  &::before {
    border-bottom: 7px solid transparent;
    border-left: 7px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 7px solid transparent;
    border-top: 7px solid ${({ theme }) => theme.colors.neonYellow};
    left: -5px;
  }
`;

const CommentNotificationTabs = css`
  display: inline-flex;
  &::before {
    border-bottom: 4px solid transparent;
    border-left: 4px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 4px solid transparent;
    border-top: 4px solid ${({ theme }) => theme.colors.neonYellow};
    left: 0;
  }
`;

const CommentNotification = styled.div`
  background-color: ${({ theme }) => theme.colors.neonYellow};
  position: relative;
  padding: 0.4rem;
  border-radius: 10%;
  margin-right: 0.5em;
  &::before {
    content: "";
    height: 0;
    width: 0;
    position: absolute;
  }

  ${(props) => props.variant === "tabs" && CommentNotificationTabs};
  ${(props) => props.variant === "nav" && CommentNotificationNavItem};
`;

export default CommentNotification;
