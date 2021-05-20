import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";
import { ReactComponent as SavingIcon } from "assets/icon-saving.svg";
import createTimer from "utils/timer";
import FadeTransition from "components/transitions/FadeTransition";
import { TransitionGroup } from "react-transition-group";
import IconText from "components/IconText";

import { NetworkActivityContext } from "components/NetworkActivityContext";

const Container = styled.div`
  --color-text: white;
`;

const rotate360 = keyframes`
  from {
    transform: rotate(360deg);
  }

  to {
    transform: rotate(0deg);
  }
`;

const Icon = styled(SavingIcon)`
  animation: ${rotate360} 3s linear infinite;
`;

export const SavingIndicator = ({ isUnauthorized, minDisplayTime = 1000 }) => {
  const [timerRunning, setTimerRunning] = useState(false);
  const { activeRequests, apiErrorOccurred } = useContext(
    NetworkActivityContext
  );
  const handleClose = useCallback(() => setTimerRunning(false), [
    setTimerRunning,
  ]);
  const timer = useMemo(() => createTimer(handleClose, minDisplayTime), [
    handleClose,
    minDisplayTime,
  ]);

  useEffect(() => {
    if (activeRequests) {
      timer.start();
      setTimerRunning(true);
    }
  }, [activeRequests]);

  const isVisible =
    !apiErrorOccurred && !isUnauthorized && (timerRunning || activeRequests);

  return (
    <TransitionGroup>
      {isVisible && (
        <FadeTransition>
          <Container>
            <IconText icon={Icon} data-test="saving-indicator">
              Saving
            </IconText>
          </Container>
        </FadeTransition>
      )}
    </TransitionGroup>
  );
};

SavingIndicator.propTypes = {
  isUnauthorized: PropTypes.bool,
  minDisplayTime: PropTypes.number,
};

export default SavingIndicator;
