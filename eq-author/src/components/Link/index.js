import styled from "styled-components";
import { colors } from "constants/theme";
import { darken } from "polished";

const darker = darken(0.1)(colors.lightBlue);

const StyledLink = styled.a`
  color: ${darker};

  &:hover {
    color: ${colors.lightBlue};
  }
`;

export default StyledLink;
