import React from "react";
import styled from "styled-components";
import Chevron from "./icon-dropdown.svg?inline";
import Button from "components/Button";
import IconText from "components/IconText";

const StyledButton = styled(Button).attrs({
  variant: "secondary"
})`
  border-radius: 0 4px 4px 0;
  flex: 0;
  padding: 0.3em;
  position: relative;

  &:focus {
    z-index: 3;
  }
`;

// Trigger needs to be a class component since the Popout manages
// a Ref and this cannot be achieved with a stateless Trigger component.
class MenuButton extends React.Component {
  render() {
    return (
      <StyledButton {...this.props}>
        <IconText hideText icon={Chevron}>
          Show additional options
        </IconText>
      </StyledButton>
    );
  }
}

export default MenuButton;
