import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";

import { colors } from "constants/theme";
import iconBold from "./icon-bold.svg?inline";
import iconEmphasis from "./icon-emphasis.svg?inline";
import iconHeading from "./icon-heading.svg?inline";
import iconList from "./icon-list.svg?inline";

import PipingMenu from "./PipingMenu";
import ToolbarButton from "./ToolbarButton";
import FadeTransition from "../FadeTransition";

export const STYLE_BLOCK = "block";
export const STYLE_INLINE = "inline";

export const styleButtons = [
  {
    id: "heading",
    title: "Heading",
    icon: iconHeading,
    type: STYLE_BLOCK,
    style: "header-two"
  },
  {
    id: "bold",
    title: "Bold",
    icon: iconBold,
    type: STYLE_INLINE,
    style: "BOLD"
  },
  {
    id: "emphasis",
    title: "Emphasis",
    icon: iconEmphasis,
    type: STYLE_INLINE,
    style: "ITALIC"
  }
];

export const formattingButtons = [
  {
    id: "list",
    title: "List",
    icon: iconList,
    type: STYLE_BLOCK,
    style: "unordered-list-item"
  }
];

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
`;

const Separator = styled.div`
  width: 1px;
  border-left: 1px solid ${colors.lightGrey};
  margin: 0.4em 0.7rem;
`;
const ToolbarPanel = styled.div`
  position: ${props => (props.visible ? "sticky" : "relative")};
  top: 0;
  z-index: 3;
  background-color: ${colors.lighterGrey};
  width: 100%;
  border-bottom: 1px solid ${colors.bordersLight};
  height: 2rem;
  opacity: ${props => (props.visible ? "1" : "0.6")};
  transition: opacity 100ms ease-out;
`;

class ToolBar extends React.Component {
  static defaultProps = {
    controls: {},
    visible: false
  };

  static propTypes = {
    onToggle: PropTypes.func.isRequired,
    onPiping: PropTypes.func.isRequired,
    isActiveControl: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    selectionIsCollapsed: PropTypes.bool.isRequired,
    controls: PropTypes.shape({
      bold: PropTypes.bool,
      emphasis: PropTypes.bool,
      heading: PropTypes.bool,
      list: PropTypes.bool,
      piping: PropTypes.bool
    })
  };

  renderButton = button => {
    const { title, icon: Icon, id } = button;
    const { isActiveControl, onToggle, controls } = this.props;

    return (
      <ToolbarButton
        key={title}
        title={title}
        disabled={!controls[id]}
        active={isActiveControl(button)}
        onClick={() => onToggle(button)}
      >
        <Icon />
      </ToolbarButton>
    );
  };

  render() {
    const {
      visible,
      onPiping,
      selectionIsCollapsed,
      controls: { piping }
    } = this.props;

    const isPipingDisabled = !(piping && selectionIsCollapsed);

    return (
      <ToolbarPanel visible={visible}>
        <TransitionGroup>
          {visible && (
            <FadeTransition>
              <ButtonGroup>
                {styleButtons.map(this.renderButton)}
                <Separator />
                {formattingButtons.map(this.renderButton)}
                <Separator />
                <PipingMenu
                  disabled={isPipingDisabled}
                  onItemChosen={onPiping}
                />
              </ButtonGroup>
            </FadeTransition>
          )}
        </TransitionGroup>
      </ToolbarPanel>
    );
  }
}

export default ToolBar;
