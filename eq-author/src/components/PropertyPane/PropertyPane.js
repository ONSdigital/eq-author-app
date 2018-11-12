/* eslint-disable camelcase */
import styled from "styled-components";
import { colors } from "constants/theme";

const PropertyPane = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${colors.white};
  padding: 1em;
  box-shadow: rgba(0, 0, 0, 0.14) 0 4px 5px 0;
`;

export default PropertyPane;
