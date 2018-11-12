import styled from "styled-components";
import PropTypes from "prop-types";
import { radius, colors, shadow } from "constants/theme";

const Panel = styled.div`
  border-radius: ${radius};
  background-color: ${colors.white};
  box-shadow: ${shadow};
`;

Panel.propTypes = {
  children: PropTypes.node.isRequired
};

export const CenteredPanel = styled(Panel)`
  padding: 2em 2.5em;
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default Panel;
