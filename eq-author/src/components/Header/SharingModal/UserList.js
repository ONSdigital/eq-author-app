import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import ScrollPane from "components/ScrollPane";

import iconGuestAvatar from "../UserProfile/icon-guest-avatar.svg";
import iconClose from "./icon-close.svg";

const List = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  color: ${colors.text};
  max-height: 10em;
`;

const ListItem = styled.li`
  margin: 0 0 0.1em;
  padding: 0.3em 0;
  display: flex;
  align-items: center;
  position: relative;
  color: #666;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 0.9em;
`;

const UserEmail = styled.div`
  font-size: 0.9em;
  margin-left: 0.5em;
  opacity: 0.7;
`;

const UserIcon = styled.img`
  margin-right: 0.25em;
  height: 1.1em;
`;

const RemoveButton = styled.button`
  appearance: none;
  width: 1.5em;
  height: 1.5em;
  background: url(${iconClose}) no-repeat center;
  background-size: 100%;
  position: absolute;
  right: 0.3em;
  border: none;
  padding: 0;
  font-size: 1rem;
  opacity: 0.5;
  &:focus {
    outline: 2px solid ${colors.tertiary};
  }
  &:hover {
    cursor: pointer;
  }
`;

const UserOwner = styled.span`
  position: absolute;
  right: 0.5em;
  font-size: 0.9em;
  font-weight: bold;
  opacity: 0.7;
`;

const UserItem = ({ user, onRemove }) => {
  const { name, email, isOwner } = user;
  const picture = user.picture || iconGuestAvatar;
  return (
    <ListItem>
      <UserIcon src={picture} alt="" />

      <UserName>{name}</UserName>
      {!isOwner && <UserEmail>{email}</UserEmail>}

      {isOwner ? (
        <UserOwner>owner</UserOwner>
      ) : (
        <RemoveButton
          onClick={() => onRemove(user)}
          aria-label="Remove editor"
        />
      )}
    </ListItem>
  );
};
UserItem.propTypes = {
  user: PropTypes.shape({
    isOwner: PropTypes.bool,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    picture: PropTypes.string,
  }),
  onRemove: PropTypes.func.isRequired,
};

const UserList = ({ editors, owner, onRemove }) => (
  <ScrollPane css={{ marginBottom: "1em" }} permanentScrollBar={false}>
    <List>
      {[{ ...owner, isOwner: true }, ...editors].map(user => (
        <UserItem key={user.id} user={user} onRemove={onRemove} />
      ))}
    </List>
  </ScrollPane>
);

const User = PropTypes.shape({
  picture: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
});

UserList.propTypes = {
  editors: PropTypes.arrayOf(User).isRequired,
  owner: User.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default UserList;
