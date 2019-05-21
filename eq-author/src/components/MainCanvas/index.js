import styled from "styled-components";

const MainCanvas = styled.div`
  max-width: ${props => props.maxWidth};
  margin: 0 auto 1em;
  padding: 0 1em;
  position: relative;
`;

MainCanvas.defaultProps = {
  maxWidth: "55em",
};

export default MainCanvas;
