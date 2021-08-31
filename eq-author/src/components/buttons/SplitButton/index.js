import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import PrimaryButton from "components/buttons/SplitButton/PrimaryButton";
import MenuButton from "components/buttons/SplitButton/MenuButton";
import Popout from "components/Popout";

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

class SplitButton extends React.Component {
  static propTypes = {
    onPrimaryAction: PropTypes.func.isRequired,
    primaryText: PropTypes.string.isRequired,
    onToggleOpen: PropTypes.func.isRequired,
    open: PropTypes.bool,
    children: PropTypes.node,
    dataTest: PropTypes.string,
    className: PropTypes.string,
  };

  static defaultProps = {
    open: false,
  };

  handleToggleOpen = (open) => {
    this.props.onToggleOpen(open);
  };

  render() {
    const {
      onPrimaryAction,
      primaryText,
      open,
      children,
      dataTest,
      className,
    } = this.props;
    const trigger = <MenuButton data-test={`${dataTest}-menu`} />;
    return (
      <FlexContainer className={className}>
        <PrimaryButton onClick={onPrimaryAction} data-test={dataTest}>
          {primaryText}
        </PrimaryButton>
        <Popout
          trigger={trigger}
          horizontalAlignment="right"
          verticalAlignment="top"
          offsetY="100%"
          onToggleOpen={this.handleToggleOpen}
          open={open}
        >
          {children}
        </Popout>
      </FlexContainer>
    );
  }
}

export default SplitButton;
