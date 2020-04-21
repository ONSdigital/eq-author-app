import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import VisuallyHidden from "components/VisuallyHidden";

import { colors } from "constants/theme";

const IconOuter = styled.div``;

const IconWithText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: ${props => (props.hideText ? 0 : "0.5em")};
  line-height: 1.3;
  color: var(--color-text);
  width: 100%;
  min-width: 0;

  svg {
    pointer-events: none;
    flex: 0 0 2em;
    path {
      fill: var(--color-text);
    }
  }
`;

const IconwithTextBelow = styled.div`
  align-items: center;
  text-align: center;
  line-height: 1.3;
  color: var(--color-text);
  width: 100%;
  min-width: 0;
  height: 70px;

  div {
    text-align: center;
    margin: 0 0.7em 0 0.7em;
    font-size: 0.6em;
  }
  svg {
    margin-top: 0.7em;
    text-align: center;
    pointer-events: none;
    flex: 0;
    path {
      fill: var(--color-text);
    }
  }
`;

const IconwithTextBelowSignout = styled.div`
  align-items: center;

  text-align: center;
  line-height: 1.3;
  color: ${colors.darkerBlack};
  width: 100%;
  min-width: 0;
  height: 60px;

  div {
    text-align: center;
    margin: 0 0.7em 0 0.7em;
    font-size: 0.9em;
  }
  svg {
    margin-top: 0.9em;
    text-align: center;
    pointer-events: none;
    flex: 0;
    color: ${colors.darkerBlack};
    path {
      fill: ${colors.darkerBlack};
    }
  }
`;

const IconText = ({
  icon: Icon,
  nav,
  signout,
  hideText,
  children,
  ...otherProps
}) => (
  <IconOuter>
    {nav && signout && (
      <IconwithTextBelowSignout hideText={hideText} {...otherProps}>
        <Icon />
        <div>
          {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
        </div>
      </IconwithTextBelowSignout>
    )}
    {nav && !signout && (
      <IconwithTextBelow hideText={hideText} {...otherProps}>
        <Icon />
        <div>
          {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
        </div>
      </IconwithTextBelow>
    )}
    {!nav && (
      <IconWithText hideText={hideText} {...otherProps}>
        <Icon />
        {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
      </IconWithText>
    )}
  </IconOuter>
);

const component = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.func,
  PropTypes.elementType,
]);

IconText.propTypes = {
  icon: component.isRequired,
  children: PropTypes.node.isRequired,
  hideText: PropTypes.bool,
  nav: PropTypes.bool,
  signout: PropTypes.bool,
};

IconText.defaultProps = {
  hideText: false,
};

export default IconText;
