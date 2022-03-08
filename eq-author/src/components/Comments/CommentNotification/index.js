import styled from "styled-components";

const CommentNotificationNavItem = styled.div`
  border-top: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-bottom: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-right: 3px solid ${({ theme }) => theme.colors.neonYellow};
  border-left: 5px solid ${({ theme }) => theme.colors.neonYellow};
  padding: 0.4rem;
  position: relative;
  background-color: ${({ theme }) => theme.colors.neonYellow};
  border-radius: 10%;
  margin-right: 0.5em;
  &::before {
    border-bottom: 7px solid transparent;
    border-left: 7px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 7px solid transparent;
    border-top: 7px solid ${({ theme }) => theme.colors.neonYellow};
    content: "";
    height: 0;
    left: -5px;
    position: absolute;
    width: 0;
  }
`;

const CommentNotification = styled.div`
  padding: 0.4rem;
  position: relative;
  background-color: ${({ theme }) => theme.colors.neonYellow};
  border-radius: 10%;
  margin-right: 0.5em;
  display: inline-flex;
  &::before {
    border-bottom: 4px solid transparent;
    border-left: 4px solid ${({ theme }) => theme.colors.neonYellow};
    border-right: 4px solid transparent;
    border-top: 4px solid ${({ theme }) => theme.colors.neonYellow};
    content: "";
    height: 0;
    left: 0;
    position: absolute;
    width: 0;
  }
`;

// const CommentNotification = () => {
//   return <CommentNotificationContainer />;
// };

// CommentNotification.propTypes = {
//   children: PropType.node,
// };

export default CommentNotification;
