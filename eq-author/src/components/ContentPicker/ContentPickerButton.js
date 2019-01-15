import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Icon from "components/ContentPicker/icon-group.svg?inline";
import ContentPickerAccordionHeader from "components/ContentPicker/ContentPickerAccordionHeader";
import { colors } from "constants/theme";

const SelectedIcon = styled(Icon)`
  --color-text: ${colors.white};
  position: absolute;
  width: 2em;
  height: 2em;
  margin: auto;
  top: 0;
  left: 0;
  bottom: 0;
  pointer-events: none;
  path {
    fill: var(--color-text);
  }
`;

const ContentPickerButton = ({ hidden, selected, label, ...otherProps }) => {
  if (hidden) {
    return null;
  }

  return (
    <ContentPickerAccordionHeader selected={selected} {...otherProps}>
      {selected ? <SelectedIcon /> : null}
      {label}
    </ContentPickerAccordionHeader>
  );
};

ContentPickerButton.propTypes = {
  hidden: PropTypes.bool,
  selected: PropTypes.bool,
  label: PropTypes.string,
};

export default ContentPickerButton;
