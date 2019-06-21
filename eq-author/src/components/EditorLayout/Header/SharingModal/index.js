import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";
import { propType } from "graphql-anywhere";
import { withRouter } from "react-router-dom";

import { raiseToast } from "redux/toast/actions";

import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import { Label, Field } from "components/Forms";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import Modal from "components/modals/Modal";
import ToggleSwitch from "components/buttons/ToggleSwitch";

import { colors } from "constants/theme";

import UserList from "./UserList";
import UserSearch from "./UserSearch";
import withAddRemoveEditor from "./withAddRemoveEditor";
import withTogglePublic from "./withTogglePublic";
import iconShare from "./icon-share.svg";

const LabelDescription = styled.span`
  font-weight: normal;
  font-size: 0.9em;
`;

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1em;
  height: 100%;
`;

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 1rem;
`;

const StyledModal = styled(Modal)`
  .Modal {
    width: 38em;
  }
`;

const ShareButton = styled(Button)`
  font-weight: normal;
  font-size: 0.9rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  padding: 0.1em;
  margin: 0.5em auto 0;

  &::after {
    content: "";
    background: url(${iconShare}) no-repeat center;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    margin-left: 0.2em;
  }

  &:hover {
    background: transparent;
    color: ${colors.secondary};
  }
`;

const ActionButtonGroup = styled(ButtonGroup)`
  position: relative;
`;

const confirmEditorRemoval = (removeEditor, currentUser, user, history) => {
  if (currentUser.id !== user.id) {
    removeEditor(user.id);
    return;
  }

  const confirmed = window.confirm(
    `You are about to remove yourself as editor.\nYou will no longer be able to edit this questionnaire and will be redirected to the homepage.`
  );
  if (confirmed) {
    removeEditor(user.id).then(() => {
      history.push("/");
    });
  }
};

const SharingModal = ({
  isOpen,
  onClose,
  addEditor,
  removeEditor,
  togglePublic,
  questionnaire,
  previewUrl,
  raiseToast,
  loading,
  data,
  currentUser,
  history,
}) => {
  const { editors, createdBy: owner, isPublic } = questionnaire;
  const handleShareClick = () => {
    const textField = document.createElement("textarea");
    textField.setAttribute("data-test", "share-link");
    textField.innerText = previewUrl;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    raiseToast("ShareToast", "Link copied to clipboard");
  };
  const existingEditors = [owner, ...editors];

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <Message>
          <CenteredHeading>
            <div>Questionnaire sharing</div>
            <ShareButton variant="tertiary" small onClick={handleShareClick}>
              Get shareable link
            </ShareButton>
          </CenteredHeading>
        </Message>
      </DialogHeader>

      <div>
        <InlineField>
          <Label inline htmlFor="public">
            Public
            <br />
            <LabelDescription>
              When enabled, this questionnaire is publicly accessible to all
              users in read-only mode. If turned off, then editors will still
              have access.
            </LabelDescription>
          </Label>
          <ToggleSwitch
            id="public"
            name="public"
            onChange={togglePublic}
            checked={isPublic}
          />
        </InlineField>
        <InlineField>
          <Label inline>
            Editors
            <br />
            <LabelDescription>
              Editors have full access to the questionnaire, including editing
              content, adding other editors and deleting the questionnaire.
            </LabelDescription>
          </Label>
        </InlineField>

        <UserList
          editors={editors}
          owner={owner}
          onRemove={user => {
            confirmEditorRemoval(removeEditor, currentUser, user, history);
          }}
        />
        {!loading && data && data.users && (
          <UserSearch
            users={data.users.filter(
              u => !existingEditors.find(editor => editor.id === u.id)
            )}
            onUserSelect={user => {
              addEditor(user.id);
            }}
          />
        )}
      </div>

      <ActionButtonGroup horizontal align="right">
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </ActionButtonGroup>
    </StyledModal>
  );
};
SharingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addEditor: PropTypes.func.isRequired,
  removeEditor: PropTypes.func.isRequired,
  togglePublic: PropTypes.func.isRequired,
  questionnaire: PropTypes.shape({
    createdBy: PropTypes.object.isRequired,
    editors: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  }).isRequired,
  previewUrl: PropTypes.string.isRequired,
  raiseToast: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.shape({
    users: PropTypes.arrayOf(propType(UserSearch.fragment)),
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export const ALL_USERS_QUERY = gql`
  query GetAllUsers {
    users {
      ...UserSearch
    }
  }

  ${UserSearch.fragment}
`;

const withAllUsers = Component => {
  const Comp = props => {
    if (!props.isOpen) {
      return <Component {...props} />;
    }
    return (
      <Query query={ALL_USERS_QUERY} fetchPolicy="network-only">
        {innerProps => {
          return <Component {...innerProps} {...props} />;
        }}
      </Query>
    );
  };

  Comp.propTypes = {
    isOpen: PropTypes.bool.isRequired,
  };
  return Comp;
};

export default flowRight([
  withRouter,
  withAllUsers,
  withAddRemoveEditor,
  withTogglePublic,
  connect(
    null,
    { raiseToast }
  ),
])(SharingModal);
