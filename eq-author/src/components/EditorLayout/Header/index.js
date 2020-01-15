import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight, get } from "lodash";
import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";

import config from "config";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
import { AWAITING_APPROVAL, PUBLISHED } from "constants/publishStatus";

import { useMe } from "App/MeContext";

import Button from "components/buttons/Button";
import LinkButton from "components/buttons/Button/LinkButton";
import RouteButton from "components/buttons/Button/RouteButton";
import IconText from "components/IconText";
import ButtonGroup from "components/buttons/ButtonGroup";
import { withQuestionnaire } from "components/QuestionnaireContext";
import UserProfile from "components/UserProfile";

import shareIcon from "./icon-share.svg?inline";
import viewIcon from "./icon-view.svg?inline";
import settingsIcon from "./icon-cog.svg?inline";
import publishIcon from "./icon-publish.svg?inline";
import reviewIcon from "./icon-review.svg?inline";
import SharingModal from "./SharingModal";
import PageTitle from "./PageTitle";
import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";
import SavingIndicator from "./SavingIndicator";

import { buildPublishPath, buildQcodesPath } from "utils/UrlUtils";

const StyledHeader = styled.header`
  color: ${colors.white};
  background: ${colors.primary};
  font-weight: 400;
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  padding: 1em 1.5em;
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

export const UtilityBtns = styled.div`
  display: flex;
  flex: 1 0 25%;
  justify-content: flex-end;
  margin-right: -1.5em;
`;

const SavingContainer = styled.div`
  position: absolute;
  right: 1em;
  bottom: 0.5em;
`;

export const UnconnectedHeader = props => {
  const { questionnaire, title, children, client, match } = props;
  const { me } = useMe();
  const [isSharingModalOpen, setSharingModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(
    match.params.modifier === "settings"
  );

  useSubscription(publishStatusSubscription, {
    variables: { id: match.params.questionnaireId },
  });
  const publishStatus = get(questionnaire, "publishStatus");
  const permission = get(questionnaire, "permission");

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
    (questionnaire || {}).id
  }`;

  const renderPublishReviewButton = () => {
    if (publishStatus === AWAITING_APPROVAL && me.admin) {
      const reviewUrl = "/q/" + match.params.questionnaireId + "/review";
      return (
        <RouteButton
          variant="tertiary-light"
          to={reviewUrl}
          small
          disabled={title === "Review"}
          data-test="btn-review"
        >
          <IconText icon={reviewIcon}>Review</IconText>
        </RouteButton>
      );
    }

    if (publishStatus === AWAITING_APPROVAL && !me.admin) {
      return null;
    }

    const canPublish = questionnaire.permission === "Write";
    return (
      <RouteButton
        variant="tertiary-light"
        to={buildPublishPath(match.params)}
        small
        disabled={
          !canPublish ||
          questionnaire.totalErrorCount > 0 ||
          title === "Publish" ||
          publishStatus === PUBLISHED
        }
        data-test="btn-publish"
      >
        <IconText icon={publishIcon}>Publish</IconText>
      </RouteButton>
    );
  };

  return (
    <>
      <StyledHeader>
        <Flex>
          <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle>
          <UtilityBtns>
            {questionnaire && (
              <ButtonGroup
                horizontal
                align="right"
                margin="0.5em"
                gutter="0.5em"
              >
                <Button
                  data-test="settings-btn"
                  variant="tertiary-light"
                  onClick={() => setSettingsModalOpen(true)}
                  small
                >
                  <IconText icon={settingsIcon}>Settings</IconText>
                </Button>
                {me.admin && (
                  <RouteButton
                    variant="tertiary-light"
                    to={buildQcodesPath(match.params)}
                    small
                    disabled={title === "QCodes"}
                    data-test="btn-review"
                  >
                    <IconText icon={settingsIcon}>QCodes</IconText>
                  </RouteButton>
                )}
                <LinkButton
                  href={previewUrl}
                  variant="tertiary-light"
                  data-test="btn-preview"
                  small
                  disabled={questionnaire.totalErrorCount > 0}
                >
                  <IconText icon={viewIcon}>View survey</IconText>
                </LinkButton>
                {renderPublishReviewButton()}
                <Button
                  variant="tertiary-light"
                  onClick={() => setSharingModalOpen(true)}
                  data-test="btn-share"
                  small
                >
                  <IconText icon={shareIcon}>Sharing</IconText>
                </Button>
                {me && <UserProfile client={client} />}
              </ButtonGroup>
            )}
          </UtilityBtns>
        </Flex>
        <PageTitle>{title}</PageTitle>
        {children}
        <SavingContainer>
          <SavingIndicator isUnauthorized={permission !== "Write"} />
        </SavingContainer>
      </StyledHeader>
      {questionnaire && (
        <>
          {me && (
            <SharingModal
              questionnaire={questionnaire}
              previewUrl={previewUrl}
              isOpen={isSharingModalOpen}
              onClose={() => setSharingModalOpen(false)}
              currentUser={me}
            />
          )}
          <UpdateQuestionnaireSettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setSettingsModalOpen(false)}
            questionnaire={questionnaire}
          />
        </>
      )}
    </>
  );
};

export const publishStatusSubscription = gql`
  subscription PublishStatus($id: ID!) {
    publishStatusUpdated(id: $id) {
      id
      publishStatus
    }
  }
`;

UnconnectedHeader.propTypes = {
  questionnaire: CustomPropTypes.questionnaire,
  title: PropTypes.string,
  client: PropTypes.shape({
    resetStore: PropTypes.func.isRequired,
  }),
  children: PropTypes.node,
  match: PropTypes.shape({
    params: PropTypes.shape({
      modifier: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default flowRight(withQuestionnaire, withRouter)(UnconnectedHeader);
