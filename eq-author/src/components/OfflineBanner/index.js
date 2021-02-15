import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { colors } from "constants/theme";
import { connect } from "react-redux";
import { isOffline, hasApiError, hasError } from "redux/saving/reducer";
import WarningIcon from "components/OfflineBanner/icon-warning.svg?inline";
import { TransitionGroup } from "react-transition-group";
import ExpansionTransition from "components/transitions/ExpansionTransition";
import IconText from "components/IconText";

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
`;

const errorMessage = {
  apiError:
    "We're unable to save your progress right now. Try refreshing the page or try again shortly",
  isOffline:
    "You're currently offline and any changes you make won't be saved. Check your connection and try again.",
};

export const UnconnectedOfflineBanner = (props) => {
  return (
    <TransitionGroup>
      {props.hasError && (
        <StyledExpansionTransition finalHeight="2.5em">
          <Banner>
            <WarningMessage icon={WarningIcon}>
              {errorMessage[props.isOffline ? "isOffline" : "apiError"]}
            </WarningMessage>
          </Banner>
        </StyledExpansionTransition>
      )}
    </TransitionGroup>
  );
};

UnconnectedOfflineBanner.propTypes = {
  isOffline: PropTypes.bool.isRequired,
  apiError: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  isOffline: isOffline(state),
  apiError: hasApiError(state),
  hasError: hasError(state),
});

export default connect(mapStateToProps)(UnconnectedOfflineBanner);
