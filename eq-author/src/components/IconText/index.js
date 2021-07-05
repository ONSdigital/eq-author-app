import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import VisuallyHidden from "components/VisuallyHidden";

const IconOuter = styled.div``;

const IconWithText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: ${(props) => (props.hideText ? 0 : "0.5em")};
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

  ${({ left }) => left && "justify-content: left;"}
`;

const IconwithTextBelow = styled.div`
  align-items: center;
  text-align: center;
  padding-top: 0.4em;
  line-height: 1.3;
  color: var(--color-text);
  width: 100%;
  min-width: 0;
  height: 70px;

  div {
    text-align: center;
    width: 70px;
    font-size: 0.65em;
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

const IconText = ({ icon: Icon, nav, hideText, children, ...otherProps }) => (
  <>
    {nav && (
      <IconOuter>
        <IconwithTextBelow hideText={hideText} {...otherProps}>
          <Icon />
          <div>
            {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
          </div>
        </IconwithTextBelow>
      </IconOuter>
    )}
    {!nav && (
      <IconWithText hideText={hideText} {...otherProps}>
        <Icon />
        {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
      </IconWithText>
    )}
  </>
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
};

IconText.defaultProps = {
  hideText: false,
};

export default IconText;
