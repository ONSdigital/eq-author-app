import styled, { css } from "styled-components";
import { colors } from "constants/theme";

import iconClose from "./icons/icon-close.svg";

import { Separator } from "./SharePageContent";

const USER_FONT_SIZE = "0.8em";

const iconColors = {
  owner: "none",
  notOwner:
    "invert(46%) sepia(4%) saturate(4439%) hue-rotate(158deg) brightness(94%) contrast(103%)",
};

export const RemoveButton = styled.button`
  appearance: none;
  width: 1.5em;
  height: 1.5em;
  background: url(${iconClose}) no-repeat center;
  background-size: 100%;
  right: 0.3em;
  border: none;
  padding: 0;
  font-size: 1rem;
  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
  &:hover {
    cursor: pointer;
  }
`;

export const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  color: ${colors.text};
`;

export const ListItem = styled.li`
  margin: 0 0 0.4em;
  display: flex;
  align-items: center;
  position: relative;
  color: #666;
`;

export const UserName = styled.span`
  font-size: ${USER_FONT_SIZE};
  color: ${colors.text};
  font-weight: bold;
  padding: 0.3em 0.5em;
`;

export const UserEmail = styled.div`
  font-size: ${USER_FONT_SIZE};
  color: ${colors.text};
  margin-left: 0.9em;
  opacity: 0.7;
  font-weight: 600;
`;

export const UserOwner = styled.span`
  font-size: ${USER_FONT_SIZE};
  color: ${colors.white};
  margin-left: 0.9em;
  margin-right: 1.2em;
  font-weight: bold;
  opacity: 0.7;
`;

export const UserIcon = styled.img`
  height: 1.1em;
  filter: ${iconColors.notOwner};
`;

export const UserSeparator = styled(Separator)`
  margin-left: 0.6em;
  border-left: 1px solid ${colors.blue};
`;

export const UserContainer = styled.div`
  background-color: ${(props) =>
    props.isOwner ? colors.black : colors.lightMediumGrey};
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.3em 0.5em;
  ${(props) =>
    props.isOwner &&
    css`
      ${UserName} {
        color: ${colors.white};
      }
      ${UserEmail} {
        color: ${colors.white};
        opacity: 1;
        margin-left: 0.5em;
      }
      ${UserIcon} {
        filter: ${iconColors.owner};
      }
      ${UserSeparator} {
        border-left: 1px solid ${colors.white};
      }
    `};
`;
