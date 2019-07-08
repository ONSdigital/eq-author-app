import styled from "styled-components";

const MainCanvas = styled.main`
  max-width: ${props => props.maxWidth};
  margin: 0 auto 1em;
  padding: 0 1em;
  position: relative;
  width: 100%;
`;

MainCanvas.defaultProps = {
  maxWidth: "55em",
};

export default MainCanvas;
