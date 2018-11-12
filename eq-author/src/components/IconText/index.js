import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import VisuallyHidden from "components/VisuallyHidden";

const IconWithText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: ${props => (props.hideText ? 0 : "0.5em")};
  line-height: 1.3;
  color: var(--color-text);
  width: 100%;

  svg {
    pointer-events: none;
    flex: 0 0 2em;
    path {
      fill: var(--color-text);
    }
  }
`;

const IconText = ({ icon: Icon, hideText, children, ...otherProps }) => (
  <IconWithText hideText={hideText} {...otherProps}>
    <Icon />
    {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
  </IconWithText>
);

IconText.propTypes = {
  icon: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  hideText: PropTypes.bool
};

IconText.defaultProps = {
  hideText: false
};

export default IconText;
