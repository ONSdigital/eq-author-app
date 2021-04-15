import React from "react";
import { TransitionGroup } from "react-transition-group";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

import IconText from "components/IconText";
import ExpansionTransition from "components/transitions/ExpansionTransition";
import WarningIcon from "components/OfflineBanner/icon-warning.svg?inline";
import Button from "components/buttons/Button";

import { colors } from "constants/theme";
import { READ, WRITE } from "constants/questionnaire-permissions";
import { AWAITING_APPROVAL } from "constants/publishStatus";

import { useQuestionnaireLockingModal } from "components/modals/QuestionnaireLockingModal";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 2.5em;
  justify-content: center;
  display: flex;
`;

const UnlockButton = styled(Button).attrs(() => ({
  small: true,
  variant: "tertiary-light",
}))`
  margin-left: 1em;
  padding: 0.25em 0.5em;
  border: 1px solid ${colors.white};
`;

const StyledExpansionTransition = styled(ExpansionTransition)`
  &.expansion-exit,
  &.expansion-exit.expansion-exit-active {
    > :first-child {
      visibility: hidden;
    }
  }
`;

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const WarningMessage = styled(IconText)`
  align-items: center;
  display: flex;
  color: ${colors.white};
  animation: ${fade} 750ms ease-in forwards;
  padding: 1em;
`;

const LockedBanner = ({ questionnaire }) => {
  const { trigger, component: UnlockModal } = useQuestionnaireLockingModal(
    questionnaire
  );

  return (
    <>
      <span>
        This questionnaire is currently locked. Any changes made will not be
        saved.
      </span>
      <UnlockModal />
      <UnlockButton onClick={trigger}>Unlock</UnlockButton>
    </>
  );
};

LockedBanner.propTypes = {
  questionnaire: PropTypes.shape({
    id: PropTypes.string.isRequired,
    locked: PropTypes.bool.isRequired,
  }),
};

const questionnaireToWarningMessage = [
  ({ permission }) =>
    permission !== WRITE &&
    "You do not have editor access to this questionnaire, any changes you make will not be saved",
  ({ publishStatus }) =>
    publishStatus === AWAITING_APPROVAL &&
    "This questionnaire is currently being reviewed. Any changes made will not be saved.",
  (questionnaire) =>
    questionnaire.locked && <LockedBanner questionnaire={questionnaire} />,
];

export const PermissionsBanner = ({ questionnaire }) => {
  const message =
    questionnaire &&
    questionnaireToWarningMessage.map((fn) => fn(questionnaire)).find(Boolean);

  return message ? (
    <TransitionGroup>
      <StyledExpansionTransition finalHeight="3.5em">
        <Banner>
          <WarningMessage icon={WarningIcon}>{message}</WarningMessage>
        </Banner>
      </StyledExpansionTransition>
    </TransitionGroup>
  ) : null;
};

PermissionsBanner.propTypes = {
  questionnaire: PropTypes.shape({
    permission: PropTypes.oneOf([READ, WRITE]).isRequired,
  }),
};

export default PermissionsBanner;
