import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import chevronIcon from "components/ContentPicker/chevron.svg";
import ContentPickerAccordionHeader from "components/ContentPicker/ContentPickerAccordionHeader";

export const TitleButton = styled(ContentPickerAccordionHeader)`
  &::after {
    content: url(${chevronIcon});
    position: absolute;
    right: 1.5em;
    transform: rotate(270deg);
  }

  &[aria-expanded="false"]::after {
    transform: rotate(-90deg);
    transition: transform 150ms ease-out;
  }

  &[aria-expanded="true"] {
    border-radius: 5px 5px 0 0;
  }
  ::after {
    transform: rotate(0deg);
    transition: transform 150ms ease-in;
  }
`;

class ContentPickerTitle extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  };

  render() {
    const { children, open, ...otherProps } = this.props;

    return (
      <TitleButton
        role="tab"
        aria-expanded={open}
        aria-selected={open}
        {...otherProps}
      >
        {children}
      </TitleButton>
    );
  }
}

export default ContentPickerTitle;
