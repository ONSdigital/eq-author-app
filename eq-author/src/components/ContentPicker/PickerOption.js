import PropTypes from "prop-types";
import Button from "components/Button";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";

const selectedStyle = css`
  color: ${colors.white};
  background: ${colors.primary};
`;

const PickerOption = styled(Button)`
  width: calc(100% - 0.25em);
  text-align: left;
  margin-bottom: 0.25em;
  display: inline-block;
  font-weight: normal;
  background: transparent;
  color: ${colors.text};
  font-size: 1em;
  padding: 0.5em 1.4em;

  &:hover {
    color: ${colors.white};
    background: ${colors.primary};
  }

  ${props => (props.selected ? selectedStyle : null)};
`;

PickerOption.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  selected: PropTypes.bool
};

export default PickerOption;
