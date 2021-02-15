import PropTypes from "prop-types";
import Button from "components/buttons/Button";
import styled, { css } from "styled-components";
import { colors, radius } from "constants/theme";

const titleStyles = {
  selected: css`
    background: ${colors.blue};
  `,
  disabled: css`
    background: ${colors.grey};
    pointer-events: none;
  `,
};

const ContentPickerAccordionHeader = styled(Button)`
  display: block;
  width: 100%;
  cursor: pointer;
  margin: 0;
  user-select: none;
  position: relative;
  padding: 0.8em 2em;
  background: ${colors.darkBlue};
  border-radius: ${radius};
  font-size: 1em;
  text-align: left;
  ${(props) => props.disabled && titleStyles.disabled};
  ${(props) => props.selected && titleStyles.selected};
`;

ContentPickerAccordionHeader.propTypes = {
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default ContentPickerAccordionHeader;
