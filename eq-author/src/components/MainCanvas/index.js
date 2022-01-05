import styled from "styled-components";

const MainCanvas = styled.main`
  max-width: ${(props) => props.maxWidth};
  margin: 0 auto 1em;
  padding: 0 1.2em;
  position: relative;
  width: 100%;
  div:first-child {
    padding-top: 1em;
  }
`;

MainCanvas.defaultProps = {
  maxWidth: "70em",
};

export default MainCanvas;
