import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const Wrapper = styled.div``;
const Header = styled.div`
  display: flex;
  align-items: center;

  h2 {
    font-size: 1em;
    color: ${colors.black};
    margin-right: 1em;
  }
`;
const Body = styled.div`
  margin-top: -1em;
  margin-left: 0.1em;
  padding: 0 0 0 0.5em;
  border-left: 3px solid ${colors.lightGrey};
`;

const CollapsibleToggled = ({
  title,
  defaultOpen = false,
  headerContent,
  children,
}) => {
  const [isOpen, toggleCollapsible] = useState(defaultOpen);

  return (
    <Wrapper data-test="CollapsibleToggled">
      <Header data-test="CollapsibleToggled__Header">
        <h2>{title}</h2>
        <ToggleSwitch
          name={`${title}-toggle-switch`}
          hideLabels={false}
          onChange={() => toggleCollapsible(!isOpen)}
          checked={isOpen}
        />
        {headerContent}
      </Header>
      {isOpen && <Body data-test="CollapsibleToggled__Body">{children}</Body>}
    </Wrapper>
  );
};

export default CollapsibleToggled;

CollapsibleToggled.propTypes = {
  /**
   * The title of the collapsible.
   */
  title: PropTypes.string.isRequired,
  /**
   * If true, the collapsible will be open when first rendered.
   */
  defaultOpen: PropTypes.bool,
  /**
   * Content to append to the end of the header, if necessary.
   */
  headerContent: PropTypes.node,
  /**
   * The content to show when the collapsible is open.
   */
  children: PropTypes.node.isRequired,
};
