import React from "react";
import PropTypes from "prop-types";

import iconGuestAvatar from "../styles/icons/icon-avatar.svg";

import {
  List,
  ListItem,
  UserContainer,
  UserName,
  UserEmail,
  UserIcon,
  RemoveButton,
  UserOwner,
  UserSeparator,
} from "../styles/UserList";

const User = PropTypes.shape({
  picture: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
});

const propTypes = {
  UserItem: {
    user: PropTypes.shape({
      isOwner: PropTypes.bool,
      name: PropTypes.string,
      email: PropTypes.string,
      picture: PropTypes.string,
    }),
    onRemove: PropTypes.func.isRequired,
  },
  UserList: {
    editors: PropTypes.arrayOf(User),
    owner: User,
    onRemove: PropTypes.func.isRequired,
  },
};

const UserItem = ({ user, onRemove }) => {
  const { name, email, isOwner } = user;
  const picture = user.picture || iconGuestAvatar;
  return (
    <ListItem data-test="user-item">
      <UserContainer isOwner={isOwner}>
        <UserIcon src={picture} alt="" />

        {name ? (
          <UserName data-test="user-name">{name}</UserName>
        ) : (
          <UserEmail data-test="user-email">{email}</UserEmail>
        )}
        {!isOwner && name && (
          <UserSeparator>
            <UserEmail data-test="user-email">{email}</UserEmail>
          </UserSeparator>
        )}

        {isOwner ? (
          <UserSeparator>
            <UserOwner data-test="user-owner">Owner</UserOwner>
          </UserSeparator>
        ) : (
          <RemoveButton
            onClick={() => onRemove(user)}
            aria-label="Remove editor"
            data-test="user-remove-btn"
          />
        )}
      </UserContainer>
    </ListItem>
  );
};

const UserList = ({ editors, owner, onRemove }) => (
  <List>
    {[{ ...owner, isOwner: true }, ...editors].map((user) => (
      <UserItem key={user.id} user={user} onRemove={onRemove} />
    ))}
  </List>
);

UserItem.propTypes = propTypes.UserItem;
UserList.propTypes = propTypes.UserList;

export default UserList;
