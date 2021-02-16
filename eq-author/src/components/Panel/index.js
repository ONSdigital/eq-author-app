import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { radius, colors } from "constants/theme";

const Panel = styled.div`
  border-radius: ${radius};
  background-color: ${colors.white};
  border: 1px solid ${colors.bordersLight};
  max-width: ${(props) => props.maxWidth};
`;

const InformationPanel = ({ children }) => {
  const StyledPanel = styled(Panel)`
    background-color: ${colors.paleBlue};
    border: 0;
    border-radius: 0;
    border-left: 0.5em solid ${colors.darkerBlue};
    padding: 1em;
    margin: 1em 0;

    p {
      margin: 0;
    }
  `;

  return (
    <StyledPanel>
      <p>{children}</p>
    </StyledPanel>
  );
};
InformationPanel.propTypes = {
  children: PropTypes.string.isRequired,
};

export { Panel, InformationPanel };

export default Panel;
