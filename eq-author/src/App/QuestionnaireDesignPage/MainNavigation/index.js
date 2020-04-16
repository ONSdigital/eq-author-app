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

import homeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/home-24px.svg?inline";
import viewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/view-survey-icon.svg?inline";
import settingsIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/settings-icon.svg?inline";
import qcodeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/q-codes-icon.svg?inline";
import publishIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/publish-icon.svg?inline";
import reviewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/variable-icon.svg?inline";
import historyIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/history-icon.svg?inline";
import metadataIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/metadata-icon.svg?inline";
import shareIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/sharing-icon.svg?inline";

import SharingModal from "./SharingModal";
// import PageTitle from "./PageTitle";
import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";
import SavingIndicator from "./SavingIndicator";

import {
  buildPublishPath,
  buildQcodesPath,
  buildMetadataPath,
  buildHistoryPath,
} from "utils/UrlUtils";

const StyledMainNavigation = styled.div`
  color: ${colors.grey};
  background: ${colors.darkerBlack};
  /* font-weight: 400; */
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  /* padding: 1em 1.5em; */
`;

const Subtitle = styled.div`
  font-weight: bold;
`;

export const UtilityBtns = styled.div`
  display: flex;
  /* flex: 1 0 25%; */
  /* justify-content: flex-end; */
  /* margin-right: -1.5em; */
`;

const SavingContainer = styled.div`
  position: absolute;
  right: 1em;
  bottom: 0.5em;
`;

export const UnconnectedMainNavigation = props => {
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
          variant="navigation"
          to={reviewUrl}
          small
          disabled={title === "Review"}
          data-test="btn-review"
        >
          <IconText nav="true" icon={reviewIcon}>
            Review
          </IconText>
        </RouteButton>
      );
    }

    if (publishStatus === AWAITING_APPROVAL && !me.admin) {
      return null;
    }

    const canPublish = questionnaire.permission === "Write";
    return (
      <RouteButton
        variant="navigation"
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
        <IconText nav="true" icon={publishIcon}>
          Publish
        </IconText>
      </RouteButton>
    );
  };

  return (
    <>
      <StyledMainNavigation>
        <Flex>
          {/* <Subtitle>{questionnaire && questionnaire.displayName}</Subtitle> */}
          <UtilityBtns>
            {questionnaire && (
              <ButtonGroup vertical align="centre" margin="0.em" gutter="0.em">
                <RouteButton variant="navigation" small to="/">
                  <IconText nav="true" icon={homeIcon}>
                    Home
                  </IconText>
                </RouteButton>
                <LinkButton
                  href={previewUrl}
                  variant="navigation"
                  data-test="btn-preview"
                  small
                  disabled={questionnaire.totalErrorCount > 0}
                >
                  <IconText nav="true" icon={viewIcon}>
                    View survey
                  </IconText>
                </LinkButton>

                <Button
                  data-test="settings-btn"
                  variant="navigation"
                  onClick={() => setSettingsModalOpen(true)}
                  small
                >
                  <IconText icon={settingsIcon} nav="true">
                    Settings
                  </IconText>
                </Button>

                <Button
                  variant="navigation"
                  onClick={() => setSharingModalOpen(true)}
                  data-test="btn-share"
                  small
                >
                  <IconText nav="true" icon={shareIcon}>
                    Sharing
                  </IconText>
                </Button>

                <RouteButton
                  variant="navigation"
                  small
                  to={buildHistoryPath(match.params)}
                >
                  <IconText nav="true" icon={historyIcon}>
                    History
                  </IconText>
                </RouteButton>
                <RouteButton
                  variant="navigation"
                  small
                  to={buildMetadataPath(match.params)}
                >
                  <IconText nav="true" icon={metadataIcon}>
                    Metadata
                  </IconText>
                </RouteButton>

                <RouteButton
                  variant="navigation"
                  to={buildQcodesPath(match.params)}
                  small
                  disabled={
                    title === "QCodes" || questionnaire.totalErrorCount > 0
                  }
                >
                  <IconText nav="true" icon={qcodeIcon}>
                    QCodes
                  </IconText>
                </RouteButton>

                {renderPublishReviewButton()}

                {me && <UserProfile nav="true" client={client} />}
              </ButtonGroup>
            )}
          </UtilityBtns>
        </Flex>
        {/* <PageTitle>{title}</PageTitle> */}
        {children}
        <SavingContainer>
          <SavingIndicator isUnauthorized={permission !== "Write"} />
        </SavingContainer>
      </StyledMainNavigation>
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

UnconnectedMainNavigation.propTypes = {
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

export default flowRight(
  withQuestionnaire,
  withRouter
)(UnconnectedMainNavigation);
