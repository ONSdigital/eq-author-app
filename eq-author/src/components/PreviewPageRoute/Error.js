import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";

const small = css`
  padding: 0.2em 0.5em;
  margin: 0;
  display: inline-block;
`;

const large = css`
  padding: 2em 1em;
`;

const Error = styled.div`
  padding: 0.5em;
  border: 2px dashed #b5c4cb;
  text-align: left;
  color: ${colors.secondary};
  font-size: 1em;
  font-weight: bold;
  margin-bottom: ${props => (props.margin ? "1em" : "0")};
  ${props => props.small && small};
  ${props => props.large && large};
`;

Error.defaultProps = {
  margin: true
};
Error.propTypes = {
  margin: PropTypes.bool,
  small: PropTypes.bool,
  large: PropTypes.bool
};

export default Error;
