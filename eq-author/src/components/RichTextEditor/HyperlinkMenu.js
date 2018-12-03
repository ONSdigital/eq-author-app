import React, { Component } from "react";

import styled, { css } from "styled-components";
import ToolbarButton from "./ToolbarButton";

import { Label, Input } from "components/Forms";

import IconLink from "./icon-hyperlink.svg?inline";

import enhanceWithClickOutside from "react-click-outside";
import "draft-js/dist/Draft.css";
import Button from "components/Button";
import { colors, radius } from "constants/theme";

const MenuContainer = styled.div`
  font-size: 0.9rem;
  position: absolute;
  top: 6.3em;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;
  width: 30em;
  height: 3.5em;
  color: white;
  background: ${colors.black};
  display: flex;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 5px 0px;
  padding: 0 1em;
  border: 1px solid ${colors.bordersLight};
  border-radius: ${radius};
`;

const LabelUrl = styled(Label)`
  margin: 0;
  flex: 1 0 auto;
  font-weight: normal;
  color: white;
`;

const InputUrl = styled(Input)`
  margin: 0 1em;
  border: 1px solid #000;
`;

const ConfirmButton = styled(Button)`
  padding: 0.25em;
  color: white;
`;

class Menu extends React.Component {
  handleClickOutside(e) {
    console.log("click ouside");

    this.props.onToggle();
  }
  render() {
    const { onChange, value, onLinkInputKeyDown, onLinkConfirm } = this.props;
    return (
      <MenuContainer>
        <LabelUrl>Enter link:</LabelUrl>
        <InputUrl
          placeholder="http://"
          type="text"
          onChange={onChange}
          value={value || "http://"}
          onKeyDown={onLinkInputKeyDown}
          autoFocus
        />
        <ConfirmButton variant="tertiary" onClick={onLinkConfirm}>
          Confirm
        </ConfirmButton>
      </MenuContainer>
    );
  }
}

const MenuWithClickOutSide = enhanceWithClickOutside(Menu);

class HyperlinkMenu extends Component {
  state = {
    showInput: false,
    value: ""
  };

  handleLinkInputKeyDown = e => {
    if (e.which === 13) {
      this.handleLinkConfirm();
    }

    if (e.which === 27) {
      this.setState({ showInput: false });
    }
  };

  handleLinkConfirm = () => {
    this.setState({ showInput: false });
    this.props.onLinkConfirm(this.state.value);
  };

  handleToggle = () => {
    this.setState({ showInput: !this.state.showInput });
  };

  handleChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    const {
      disabled,
      canFocus,
      buttonConfig,
      onLinkRemove,
      onLinkToggle
    } = this.props;
    return (
      <React.Fragment>
        <ToolbarButton
          {...buttonConfig}
          disabled={disabled}
          canFocus={canFocus}
          onClick={this.handleToggle}
        >
          <IconLink />
        </ToolbarButton>
        {this.state.showInput && (
          <MenuWithClickOutSide
            onToggle={() => {
              this.state.showInput && this.handleToggle();
            }}
            onLinkConfirm={this.handleLinkConfirm}
            onLinkRemove={onLinkRemove}
            onLinkToggle={onLinkToggle}
            onChange={this.handleChange}
            value={this.state.value}
            onLinkInputKeyDown={this.handleLinkInputKeyDown}
          />
        )}
      </React.Fragment>
    );
  }
}

export default HyperlinkMenu;
