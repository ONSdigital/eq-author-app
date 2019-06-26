import React from "react";
import { TransitionGroup } from "react-transition-group";
import styled, { keyframes } from "styled-components";
import PropTypes from "prop-types";

import IconText from "components/IconText";
import ExpansionTransition from "components/transitions/ExpansionTransition";
import { colors } from "constants/theme";
import { READ, WRITE } from "constants/questionnaire-permissions";
import WarningIcon from "components/OfflineBanner/icon-warning.svg?inline";

const Banner = styled.div`
  background-color: ${colors.red};
  height: 2.5em;
  justify-content: center;
  display: flex;
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

export const PermissionsBanner = ({ questionnaire }) => {
  if (!questionnaire) {
    return null;
  }
  const userCanEdit = questionnaire.permission === WRITE;
  if (userCanEdit) {
    return null;
  }
  return (
    <TransitionGroup>
      <StyledExpansionTransition finalHeight="3.5em">
        <Banner>
          <WarningMessage icon={WarningIcon}>
            You do not have editor access to this questionnaire, any changes you
            make will not be saved
          </WarningMessage>
        </Banner>
      </StyledExpansionTransition>
    </TransitionGroup>
  );
};

PermissionsBanner.propTypes = {
  questionnaire: PropTypes.shape({
    permission: PropTypes.oneOf([READ, WRITE]).isRequired,
  }),
};

export default PermissionsBanner;
