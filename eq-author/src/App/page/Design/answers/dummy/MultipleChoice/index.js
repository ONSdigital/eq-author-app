import styled from "styled-components";
import PropTypes from "prop-types";
import { radius, colors } from "constants/theme";
import { CHECKBOX, RADIO, MUTUALLY_EXCLUSIVE } from "constants/answer-types";
import { get } from "lodash";

const borderRadii = (hasMultipleOptions) => {
  const radii = {
    [CHECKBOX]: radius,
    [RADIO]: "100%",
    [MUTUALLY_EXCLUSIVE]: hasMultipleOptions ? "100%" : radius,
  };

  return radii;
};

const MultipleChoice = styled.div.attrs({
  "data-test": "dummy-multiple-choice",
})`
  background: ${colors.lightMediumGrey};
  background-size: cover;
  height: 1.4em;
  width: 1.4em;
  display: inline-block;
  margin: 2em 1em 0 0;
  border-radius: ${(props) =>
    get(borderRadii(props.hasMultipleOptions), props.type, "initial")};
  flex: 0 0 auto;
`;

MultipleChoice.propTypes = {
  type: PropTypes.oneOf([CHECKBOX, RADIO, MUTUALLY_EXCLUSIVE]),
  hasMultipleOptions: PropTypes.bool,
};

export default MultipleChoice;
