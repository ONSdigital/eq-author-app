import styled, { css } from "styled-components";

const CommentNotificationNavItem = css`
  border-top: 1px solid ${({ theme }) => theme.colors.neonYellow};
  border-bottom: 1px solid ${({ theme }) => theme.colors.neonYellow};
  border-right: 2px solid ${({ theme }) => theme.colors.neonYellow};
  border-left: 4px solid ${({ theme }) => theme.colors.neonYellow};
  &::before {
    border-bottom: 6px solid transparent;
    border-left: 6px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 6px solid transparent;
    border-top: 6px solid ${({ theme }) => theme.colors.neonYellow};
    left: -4px;
  }
`;

const CommentNotificationTabs = css`
  display: inline-flex;
  padding-top: 0.35rem;
  padding-bottom: 0.35rem;
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
    position: absolute;
  }

  ${(props) => props.variant === "tabs" && CommentNotificationTabs};
  ${(props) => props.variant === "nav" && CommentNotificationNavItem};
`;

export default CommentNotification;
