import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { Query } from "react-apollo";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";
import { propType } from "graphql-anywhere";

import { raiseToast } from "redux/toast/actions";

import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import { Label, Field } from "components/Forms";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import Modal from "components/modals/Modal";

import { colors } from "constants/theme";

import UserList from "./UserList";
import UserSearch from "./UserSearch";
import withAddRemoveEditor from "./withAddRemoveEditor";
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

const SharingModal = ({
  isOpen,
  onClose,
  addEditor,
  removeEditor,
  questionnaire,
  previewUrl,
  raiseToast,
  loading,
  data,
}) => {
  const { editors, createdBy: owner } = questionnaire;
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
            removeEditor(user.id);
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
  withAllUsers,
  withAddRemoveEditor,
  connect(
    null,
    { raiseToast }
  ),
])(SharingModal);
