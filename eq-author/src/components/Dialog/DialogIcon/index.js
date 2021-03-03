import PropTypes from "prop-types";
import styled from "styled-components";

const DialogIcon = styled.div`
  background: url(${(props) => props.icon}) no-repeat center;
  width: 3em;
  height: 3em;
`;

DialogIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default styled(DialogIcon)`
  flex-grow: 0;
  margin-right: 0.5em;
`;
