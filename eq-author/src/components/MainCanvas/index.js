import styled from "styled-components";

const MainCanvas = styled.div`
  width: ${props => props.width};
  margin: 0 auto 1em;
  padding: 0 1em;
  position: relative;
`;

MainCanvas.defaultProps = {
  width: "55em",
};

export default MainCanvas;
