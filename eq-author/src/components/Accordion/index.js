import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import PanelTitle from "components/Accordion/PanelTitle";
import PanelBody from "components/Accordion/PanelBody";
import chevronIcon from "components/Accordion/chevron.svg";
import { colors } from "constants/theme";

export const KEY_CODE_ESCAPE = 27;

const AccordionTitle = styled(PanelTitle)`
  cursor: pointer;
  margin: 0;
  user-select: none;
  position: relative;
  padding: 0.25em;

  & button {
    color: ${colors.text};
    font-size: 0.7em;
    font-weight: 900;
    background: none;
    border: none;
    width: 100%;
    height: 100%;
    padding: 0.6em 1em;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    outline: none;

    &:focus {
      outline: -webkit-focus-ring-color auto 5px;
    }

    &::after {
      content: url(${chevronIcon});
      float: right;
    }

    &[aria-expanded="false"]::after {
      transform: rotate(0deg);
      transition: transform 150ms ease-out;
    }

    &[aria-expanded="true"]::after {
      transform: rotate(-180deg);
      transition: transform 150ms ease-in;
    }
  }
`;

const AccordionBody = styled(PanelBody)`
  padding: 0.6em 1em;
  position: relative;

  &[aria-hidden="true"] {
    display: none;
  }

  &[aria-hidden="false"] {
    display: block;
  }
`;

export const AccordionInner = styled.div`
  border-bottom: 1px solid ${colors.borders};
`;

export class AccordionPanel extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    open: PropTypes.bool
  };

  static defaultProps = {
    open: false
  };

  constructor(props) {
    super(props);
    this.state = {
      open: props.open
    };
  }

  handleTitleClick = () => {
    this.state.open ? this.close() : this.open();
  };

  open = () => {
    this.setState({ open: true }, () => this.panel.scrollIntoView());
  };

  close = () => {
    this.setState({ open: false });
  };

  handleKeyUp = e => {
    if (e.keyCode === KEY_CODE_ESCAPE) {
      this.close();
    }
  };

  saveRef = panel => {
    this.panel = panel;
  };

  render() {
    const { title, children } = this.props;
    const { open } = this.state;
    const id = `accordion-panel-${this.props.id}`;

    return (
      <AccordionInner onKeyUp={this.handleKeyUp}>
        <AccordionTitle
          id={"panel-title-" + id}
          controls={"panel-body-" + id}
          open={this.state.open}
          onClick={this.handleTitleClick}
          innerRef={this.saveRef}
        >
          {title}
        </AccordionTitle>
        <AccordionBody
          id={"panel-body-" + id}
          labelledBy={"panel-title-" + id}
          open={open}
        >
          {children}
        </AccordionBody>
      </AccordionInner>
    );
  }
}

const StyledDiv = styled.div`
  width: 100%;
`;

const StatelessAccordion = ({ children }) => (
  <StyledDiv role="tablist" aria-multiselectable="true">
    {children}
  </StyledDiv>
);

StatelessAccordion.propTypes = {
  children: PropTypes.node
};

export const Accordion = StatelessAccordion;
