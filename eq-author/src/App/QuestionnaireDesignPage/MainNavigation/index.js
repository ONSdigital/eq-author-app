import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useSubscription } from "react-apollo";
import config from "config";

import { colors } from "constants/theme";
import { useMe } from "App/MeContext";

import ButtonGroup from "components/buttons/ButtonGroup";
import LinkButton from "components/buttons/Button/LinkButton";
import RouteButton from "components/buttons/Button/RouteButton";
import IconText from "components/IconText";
import Badge from "components/Badge";

import UserProfile from "components/UserProfile";

import homeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/home-24px.svg?inline";

import settingsIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/settings-icon.svg?inline";
import qcodeIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/q-codes-icon.svg?inline";
import historyIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/history-icon.svg?inline";
import metadataIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/metadata-icon.svg?inline";
import shareIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/sharing-icon.svg?inline";
import viewIcon from "App/QuestionnaireDesignPage/MainNavigation/icons/view-survey-icon.svg?inline";

import UpdateQuestionnaireSettingsModal from "./UpdateQuestionnaireSettingsModal";

import { useQCodeContext } from "components/QCodeContext";

import {
  buildQcodesPath,
  buildMetadataPath,
  buildHistoryPath,
  buildSharingPath,
  buildSettingsPath,
} from "utils/UrlUtils";

const StyledMainNavigation = styled.div`
  color: ${colors.grey};
  background: ${colors.black};
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

export const UnwrappedMainNavigation = ({
  hasQuestionnaire,
  totalErrorCount,
  qcodesEnabled,
  settingsError,
  formTypeErrorCount,
  title,
  children,
  hasSurveyID,
}) => {
  const params = useParams();
  const { hasQCodeError } = useQCodeContext();
  const { me } = useMe();
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(
    params.modifier === "settings"
  );
  const whatPageAreWeOn = params.entityName;
  useSubscription(publishStatusSubscription, {
    variables: { id: params.questionnaireId },
  });
  const totalErrorCountNoFormType = totalErrorCount - formTypeErrorCount;

  if (!hasSurveyID) {
    totalErrorCount = totalErrorCount - 1;
  }

  const previewUrl = `${config.REACT_APP_LAUNCH_URL}/${params.questionnaireId}`;

  return (
    <>
      <StyledMainNavigation data-test="main-navigation">
        <Flex>
          <UtilityBtns>
            {hasQuestionnaire && (
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
                  disabled={totalErrorCountNoFormType > 0}
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
                  to={`${buildSettingsPath(params)}/general`}
                  small
                  data-test="btn-settings"
                  disabled={title === "Settings"}
                >
                  <IconText nav icon={settingsIcon}>
                    Settings
                  </IconText>
                  {settingsError && (
                    <Badge
                      data-test="settings-error-badge"
                      variant="main-nav"
                    />
                  )}
                </RouteButton>
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "sharing" && "navigation-on") ||
                    "navigation"
                  }
                  small
                  data-test="btn-sharing"
                  to={buildSharingPath(params)}
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
                  to={buildHistoryPath(params)}
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
                  to={buildMetadataPath(params)}
                >
                  <IconText nav icon={metadataIcon}>
                    Metadata
                  </IconText>
                </RouteButton>
                <RouteButton
                  variant={
                    (whatPageAreWeOn === "qcodes" && "navigation-on") ||
                    "navigation"
                  }
                  to={buildQcodesPath(params)}
                  small
                  data-test="btn-qcodes"
                  disabled={
                    title === "QCodes" || totalErrorCount > 0 || !qcodesEnabled
                  }
                >
                  <IconText nav icon={qcodeIcon}>
                    QCodes
                  </IconText>
                  {qcodesEnabled && hasQCodeError && (
                    <Badge data-test="small-badge" variant="main-nav" />
                  )}
                </RouteButton>
                {me && <UserProfile nav />}
              </ButtonGroup>
            )}
          </UtilityBtns>
        </Flex>
        {children}
      </StyledMainNavigation>
      {hasQuestionnaire && (
        <UpdateQuestionnaireSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
        />
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
  qcodesEnabled: PropTypes.bool,
  hasQuestionnaire: PropTypes.bool.isRequired,
  totalErrorCount: PropTypes.number.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  settingsError: PropTypes.bool,
  formTypeErrorCount: PropTypes.number,
  hasSurveyID: PropTypes.bool,
};

export default UnwrappedMainNavigation;
