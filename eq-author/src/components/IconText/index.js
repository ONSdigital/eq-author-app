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

  @media (max-height: 577px) {
    height: auto;
    padding-top: 0;
    padding-bottom: 0.4em;
  }

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

const TextContainer = styled.div`
  font-weight: ${(props) => props.bold && `bold`};
  margin-left: ${(props) => props.withMargin && `0.5em`};
`;

const IconText = ({
  icon: Icon,
  nav,
  hideText,
  children,
  bold = false,
  withMargin = false,
  ...otherProps
}) => (
  <>
    {nav && (
      <IconOuter>
        <IconwithTextBelow hideText={hideText} {...otherProps}>
          <Icon />
          <TextContainer bold={bold}>
            {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
          </TextContainer>
        </IconwithTextBelow>
      </IconOuter>
    )}
    {!nav && (
      <IconWithText hideText={hideText} {...otherProps}>
        <Icon />
        <TextContainer bold={bold} withMargin={withMargin}>
          {hideText ? <VisuallyHidden>{children}</VisuallyHidden> : children}
        </TextContainer>
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
  bold: PropTypes.bool,
  withMargin: PropTypes.bool,
};

IconText.defaultProps = {
  hideText: false,
};

export default IconText;
