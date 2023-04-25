import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const Wrapper = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${(props) => !props.title && `-1em`};
  margin-bottom: ${(props) =>
    props.withContentSpace && props.isOpen && `1.5em`};

  h2 {
    font-size: 1em;
    color: ${colors.black};
    margin-right: 1em;
    min-width: 7.5em;
  }
`;

const Body = styled.div`
  margin-top: -1em;
  margin-left: 0.1em;
  padding: 0 0 0 0.5em;
  border-left: 3px solid ${colors.lightGrey};
`;

const UnquotedBody = styled.div``;

const CollapsibleToggled = ({
  id,
  title,
  isOpen = false,
  headerContent,
  ariaLabel,
  children,
  onChange,
  quoted = true,
  withContentSpace,
}) => {
  return (
    <Wrapper data-test="CollapsibleToggled">
      <Header
        title={title}
        withContentSpace={withContentSpace}
        isOpen={isOpen}
        data-test="CollapsibleToggled__Header"
      >
        {title && <h2>{title}</h2>}
        <ToggleSwitch
          id={id}
          name={`${id}-toggle-switch`}
          hideLabels={false}
          onChange={onChange}
          checked={isOpen}
          ariaLabel={ariaLabel}
          data-test={id}
        />
        {headerContent}
      </Header>
      {isOpen && quoted && (
        <Body data-test="collapsible-toggled-body-quoted">{children}</Body>
      )}
      {isOpen && !quoted && (
        <UnquotedBody data-test="collapsible-toggled-body-unquoted">
          {children}
        </UnquotedBody>
      )}
    </Wrapper>
  );
};

export default CollapsibleToggled;

CollapsibleToggled.propTypes = {
  /**
   * The title of the collapsible.
   */
  title: PropTypes.string,
  /**
   * If true, the collapsible will be open.
   */
  isOpen: PropTypes.bool,
  /**
   * Aria label to be read by a screen reader
   */
  ariaLabel: PropTypes.string,
  /**
   * Content to append to the end of the header, if necessary.
   */
  headerContent: PropTypes.node,
  /**
   * The content to show when the collapsible is open.
   */
  children: PropTypes.node.isRequired,
  /**
   * Function called when toggle value is changed.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Determines if the collapsible's content uses the quoted format with border-left.
   */
  quoted: PropTypes.bool,
  /**
   * Adds a space between the toggle switch and the collapsible's content.
   */
  withContentSpace: PropTypes.bool,
};
