import styled from "styled-components";
import PropTypes from "prop-types";
import { sharedStyles } from "components/Forms/css";
import { colors } from "constants/theme";

const DummyTextArea = styled.div`
  ${sharedStyles};
  border-color: ${colors.lightGrey};
  padding: 1.2em 1.2em 1.2em 2em;
  position: relative;
  background-color: transparent;
  width: 50%;
  height: ${props => props.rows + 2}em;
  pointer-events: none;
`;

DummyTextArea.propTypes = {
  rows: PropTypes.number
};

DummyTextArea.defaultPropTypes = {
  rows: 1
};

export default DummyTextArea;
