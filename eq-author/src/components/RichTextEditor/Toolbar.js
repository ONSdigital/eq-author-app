import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";
import iconBold from "components/RichTextEditor/icon-bold.svg?inline";
import iconEmphasis from "components/RichTextEditor/icon-emphasis.svg?inline";
import iconHeading from "components/RichTextEditor/icon-heading.svg?inline";
import iconList from "components/RichTextEditor/icon-list.svg?inline";

import PipingMenu from "components/RichTextEditor/PipingMenu";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";
import LinkButton from "./LinkPlugin/ToolbarButton";

export const STYLE_BLOCK = "block";
export const STYLE_INLINE = "inline";

export const styleButtons = [
  {
    id: "heading",
    title: "Heading",
    icon: iconHeading,
    type: STYLE_BLOCK,
    style: "header-two",
  },
  {
    id: "bold",
    title: "Bold",
    icon: iconBold,
    type: STYLE_INLINE,
    style: "BOLD",
  },
  {
    id: "emphasis",
    title: "Highlight",
    icon: iconEmphasis,
    type: STYLE_INLINE,
    style: "ITALIC",
  },
];

export const formattingButtons = [
  {
    id: "list",
    title: "List",
    icon: iconList,
    type: STYLE_BLOCK,
    style: "unordered-list-item",
  },
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
  position: ${(props) => (props.visible ? "sticky" : "relative")};
  top: 0;
  z-index: 3;
  background-color: ${colors.lighterGrey};
  width: 100%;
  border-bottom: 1px solid ${colors.bordersLight};
  height: 2rem;
  transition: opacity 100ms ease-out;
`;

class ToolBar extends React.Component {
  static defaultProps = {
    controls: {},
    visible: false,
  };

  static propTypes = {
    pageType: PropTypes.string,
    onToggle: PropTypes.func.isRequired,
    onPiping: PropTypes.func.isRequired,
    onLinkChosen: PropTypes.func,
    isActiveControl: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    selectionIsCollapsed: PropTypes.bool.isRequired,
    controls: PropTypes.shape({
      bold: PropTypes.bool,
      emphasis: PropTypes.bool,
      heading: PropTypes.bool,
      list: PropTypes.bool,
      piping: PropTypes.bool,
      link: PropTypes.bool,
    }),
    testId: PropTypes.string,
    allowableTypes: PropTypes.arrayOf(PropTypes.string),
    defaultTab: PropTypes.string,
    editorState: PropTypes.shape({
      getSelection: PropTypes.fn,
    }),
    linkCount: PropTypes.number,
    linkLimit: PropTypes.number,
    allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
  };

  renderButton = (button) => {
    const { title, icon: Icon, id } = button;
    const { isActiveControl, onToggle, controls, visible } = this.props;

    return (
      <ToolbarButton
        key={title}
        title={title}
        disabled={!controls[id]}
        active={isActiveControl(button)}
        onClick={() => onToggle(button)}
        canFocus={visible}
      >
        <Icon />
      </ToolbarButton>
    );
  };

  render() {
    const {
      pageType,
      visible,
      onPiping,
      onLinkChosen,
      selectionIsCollapsed,
      editorState,
      controls: { piping, link },
      testId,
      allowableTypes,
      defaultTab,
      linkCount,
      linkLimit,
      allCalculatedSummaryPages,
    } = this.props;

    const isPipingDisabled = !(piping && selectionIsCollapsed);

    const isLinkDisabled = () => {
      if (!link) {
        return true;
      } else if (linkCount >= linkLimit) {
        return true;
      } else {
        return false;
      }
    };

    return (
      <ToolbarPanel visible={visible} data-test={testId}>
        <ButtonGroup>
          {styleButtons.map(this.renderButton)}
          <Separator />
          {formattingButtons.map(this.renderButton)}
          {piping && (
            <>
              <Separator />
              <PipingMenu
                pageType={pageType}
                disabled={isPipingDisabled}
                onItemChosen={onPiping}
                canFocus={visible}
                allowableTypes={allowableTypes}
                defaultTab={defaultTab}
                allCalculatedSummaryPages={allCalculatedSummaryPages}
              />
            </>
          )}
          <Separator />
          <LinkButton
            canFocus={visible}
            disabled={isLinkDisabled()}
            onLinkChosen={onLinkChosen}
            editorState={editorState}
          />
        </ButtonGroup>
      </ToolbarPanel>
    );
  }
}

export default ToolBar;
