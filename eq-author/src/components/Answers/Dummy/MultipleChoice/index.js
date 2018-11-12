import styled from "styled-components";
import PropTypes from "prop-types";
import { radius, colors } from "constants/theme";
import { CHECKBOX, RADIO } from "constants/answer-types";
import { get } from "lodash";
import placeholder from "../placeholder.svg";

const borderRadii = {
  [CHECKBOX]: radius,
  [RADIO]: "100%"
};

const MultipleChoice = styled.div`
  background: transparent url(${placeholder}) no-repeat center center;
  background-size: cover;
  height: 1.4em;
  width: 1.4em;
  display: inline-block;
  margin: 2em 1em 0 0;
  border-radius: ${props => get(borderRadii, props.type, "initial")};
  flex: 0 0 auto;
  border: 3px solid ${colors.bordersLight};
`;

MultipleChoice.propTypes = {
  type: PropTypes.oneOf(Object.keys(borderRadii))
};

export default MultipleChoice;
