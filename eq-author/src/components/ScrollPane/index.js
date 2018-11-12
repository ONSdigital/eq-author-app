import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";
import { darken } from "polished";

const ScrollPane = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: ${props => (props.permanentScrollBar ? "scroll" : "auto")};
  position: relative;

  -webkit-background-clip: text;
  transition: background-color 0.2s;
  background-color: rgba(0, 0, 0, 0.18);

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    box-shadow: none;
    background-color: ${colors.lightGrey};
    transition: background-color 0.2s;
  }

  ::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: none;
    display: none;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }

  > :first-child {
    backface-visibility: hidden !important;
  }

  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: ${darken(0.1, colors.lightGrey)};
    }
  }
`;

ScrollPane.propTypes = {
  permanentScrollBar: PropTypes.bool
};

ScrollPane.defaultProps = {
  permanentScrollBar: false
};

export default ScrollPane;
