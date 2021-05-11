import React from "react";
import PropTypes from "prop-types";
import config from "config";

import { flowRight } from "lodash";
import { Query, useMutation } from "react-apollo";
import styled from "styled-components";

import GET_QUESTIONNAIRE from "../graphql/GetQuestionnaire.graphql";
import TOGGLE_PUBLIC_MUTATION from "../graphql/TogglePublicMutation.graphql";

import Loading from "components/Loading";
import Error from "components/Error";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import { InformationPanel } from "components/Panel";
import { withShowToast } from "components/Toasts";
import { Field, Label } from "components/Forms";


import EditorSearch from "./EditorSearch";

import {
  Layout,
  SharePageTitle,
  Description,
  Section,
  ShareSectionTitle,
  PublicLabel,
  ShareLinkButton,
} from "../styles/SharePageContent";

const propTypes = {
  TogglePublicLabel: {
    text: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
  },
  Sharing: {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      isPublic: PropTypes.bool.isRequired,
    }),
    toast: PropTypes.func.isRequired,
  },
  GetQuestionnaireWrapper: {
    questionnaireId: PropTypes.string,
  },
};

export const TogglePublicLabel = ({ text, isActive }) => (
  <PublicLabel isActive={isActive}>{text}</PublicLabel>
);

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

export const Sharing = ({ data, showToast }) => {
  const { id, isPublic, createdBy, editors } = data.questionnaire;

  const [updateIsPublic] = useMutation(TOGGLE_PUBLIC_MUTATION);

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
    (data.questionnaire || {}).id
  }`;

  const togglePublic = () =>
    updateIsPublic({
      variables: { input: { id, isPublic: !isPublic } },
    });

  const handleShareClick = () => {
    const textField = document.createElement("textarea");
    textField.setAttribute("data-test", "share-link");
    textField.innerText = previewUrl;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
    showToast("Link copied to clipboard");
  };

  return (
    <Layout>
      <SharePageTitle>Share your questionnaire</SharePageTitle>
      <Description>
        You can share your questionnaire with anyone who has an account in
        Author.
      </Description>
      <ShareLinkButton
        variant="tertiary"
        small
        onClick={handleShareClick}
        data-test="share-button"
      >
        Get shareable link
      </ShareLinkButton>
      <Section>
      <InlineField>
        <Label>Public access</Label>
        <ToggleSwitch
          id="public"
          name="public"
          hideLabels={false}
          onChange={togglePublic}
          checked={isPublic}
        />
        </InlineField>
        <InformationPanel>
          Let anyone with an Author account view your questionnaire. If public
          access is off, only editors will be able to view it.
        </InformationPanel>
      </Section>
      <Section>
        <ShareSectionTitle>Editors</ShareSectionTitle>
        <InformationPanel>
          Editors can edit questionnaire content, add comments, delete the
          questionnaire and add other editors.
        </InformationPanel>
      </Section>
      <EditorSearch
        questionnaireId={id}
        owner={createdBy}
        editors={editors}
        showToast={showToast}
      />
    </Layout>
  );
};

const QueryWrapper = (Component) => {
  const GetQuestionnaireWrapper = (props) => (
    <Query
      query={GET_QUESTIONNAIRE}
      variables={{
        input: {
          questionnaireId: props.questionnaireId,
        },
      }}
    >
      {(innerprops) => {
        if (innerprops.loading) {
          return <Loading height="38rem">Page loading…</Loading>;
        }
        if (innerprops.error) {
          return <Error>Oops! Something went wrong</Error>;
        }
        return <Component data={innerprops.data} {...props} />;
      }}
    </Query>
  );
  GetQuestionnaireWrapper.propTypes = propTypes.GetQuestionnaireWrapper;

  return GetQuestionnaireWrapper;
};

const ToastedUnwrappedSharing = flowRight(withShowToast, QueryWrapper)(Sharing);

TogglePublicLabel.propTypes = propTypes.ToggleLabelComp;
Sharing.propTypes = propTypes.Share;

export default ToastedUnwrappedSharing;
