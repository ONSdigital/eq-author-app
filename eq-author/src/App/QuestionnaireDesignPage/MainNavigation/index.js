import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
// import { flowRight, get } from "lodash";

import { withRouter } from "react-router-dom";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";

import config from "config";
import CustomPropTypes from "custom-prop-types";

import { colors } from "constants/theme";
// import { AWAITING_APPROVAL, PUBLISHED } from "constants/publishStatus";

import { useMe } from "App/MeContext";

import ButtonGroup from "components/buttons/ButtonGroup";
import LinkButton from "components/buttons/Button/LinkButton";
import RouteButton from "components/buttons/Button/RouteButton";
import IconText from "components/IconText";

import { withQuestionnaire } from "components/QuestionnaireContext";
import UserProfile from "components/UserProfile";

import homeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/home-24px.svg?inline";

import settingsIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/settings-icon.svg?inline";
import qcodeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/q-codes-icon.svg?inline";
// import publishIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/publish-icon.svg?inline";
// import reviewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/review-icon.svg?inline";
import historyIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/history-icon.svg?inline";
import metadataIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/metadata-icon.svg?inline";
import shareIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/sharing-icon.svg?inline";
import viewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/view-survey-icon.svg?inline";

import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";

import {
  // buildPublishPath,
  buildQcodesPath,
  buildMetadataPath,
  buildHistoryPath,
  buildSharingPath,
  buildSettingsPath,
} from "utils/UrlUtils";

const StyledMainNavigation = styled.div`
  color: ${colors.grey};
  background: ${colors.darkerBlack};
  position: relative;
`;

const Flex = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
`;

export const UtilityBtns = styled.div`
  display: flex;
`;

const SmallBadge = styled.span`
  border-radius: 50%;
  background-color: ${colors.red};
  border: 1px solid ${colors.white};
  font-weight: normal;
  z-index: 2;
  pointer-events: none;
  width: 0.75em;
  height: 0.75em;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 2px;
  right: 2px;
`;

export const UnwrappedMainNavigation = props => {
  const { questionnaire, title, children, client, match } = props;

  const { me } = useMe();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(
    match.params.modifier === "settings"
  );
  const whatPageAreWeOn = match.params.entityName;
  useSubscription(publishStatusSubscription, {
    variables: { id: match.params.questionnaireId },
  });

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${
    (questionnaire || {}).id
    }`;

  return (
    <>
      <StyledMainNavigation data-test="main-navigation">
        <Flex>
          <UtilityBtns>
            {questionnaire && (
              <ButtonGroup vertical align="centre" margin="0.em" gutter="0.em">
                <RouteButton variant="navigation" small to="/">
                  <IconText nav icon={homeIcon}>
                    Home
                  </IconText>
                </RouteButton>
                <LinkButton
                  href={previewUrl}
                  variant="navigation-modal"
                  data-test="btn-preview"
                  small
                  disabled={questionnaire.totalErrorCount > 0}
                >
                  <IconText nav icon={viewIcon}>
                    View survey
                  </IconText>
                </LinkButton>
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "settings" && "navigation-on") ||
                    "navigation"
                  }
                  to={buildSettingsPath(match.params)}
                  small
                  data-test="btn-settings"
                  disabled={title === "Settings"}
                >
                  <IconText nav icon={settingsIcon}>
                    Settings
                  </IconText>
                </RouteButton>
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "sharing" && "navigation-on") ||
                    "navigation"
                  }
                  small
                  data-test="btn-sharing"
                  to={buildSharingPath(match.params)}
                >
                  <IconText nav icon={shareIcon}>
                    Sharing
                  </IconText>
                </RouteButton>
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "history" && "navigation-on") ||
                    "navigation"
                  }
                  small
                  data-test="btn-history"
                  to={buildHistoryPath(match.params)}
                >
                  <IconText nav icon={historyIcon}>
                    History
                  </IconText>
                </RouteButton>

                <RouteButton
                  variant={
                    (whatPageAreWeOn === "metadata" && "navigation-on") ||
                    "navigation"
                  }
                  small
                  data-test="btn-metadata"
                  to={buildMetadataPath(match.params)}
                >
                  <IconText nav icon={metadataIcon}>
                    Metadata
                  </IconText>
                </RouteButton>
                {/* {renderPublishReviewButton()} */}
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "qcodes" && "navigation-on") ||
                    "navigation"
                  }
                  to={buildQcodesPath(match.params)}
                  small
                  data-test="btn-qcodes"
                  disabled={
                    title === "QCodes" || questionnaire.totalErrorCount > 0
                  }
                >
                  <IconText nav icon={qcodeIcon}>
                    QCodes
                  </IconText>
                  {questionnaire.qCodeErrorCount > 0 ? <SmallBadge data-test="small-badge" /> : null}
                </RouteButton>
                {me && <UserProfile nav signOut left client={client} />}
              </ButtonGroup>
            )}
          </UtilityBtns>
        </Flex>
        {children}
      </StyledMainNavigation>
      {questionnaire && (
        <>
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

UnwrappedMainNavigation.propTypes = {
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
)(UnwrappedMainNavigation);
