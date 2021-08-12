import React, { Component } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Header = styled.div`
  background: #f8f8f8;
  padding: 0 0.25em;
  border-top: 1px solid ${colors.lightMediumGrey};
  border-bottom: 1px solid ${colors.lightMediumGrey};
  &:hover {
    background: #f3f3f3;
  }
`;

export const Title = styled.h2`
  font-size: 0.75em;
  letter-spacing: 0.05em;
  vertical-align: middle;
  color: #4a4a4a;
  text-align: left;
  margin: 0;
  padding: 0.5em 0;
  position: relative;
`;

export const Body = styled.div`
  overflow: hidden;
  transition: opacity 100ms ease-in-out;
  opacity: ${(props) => (props.open ? "1" : "0")};
  height: ${(props) => (props.open ? "auto" : "0")};
`;

const Container = styled.div`
  /* fixes ghosting issue in Chrome */
  backface-visibility: hidden;
  &:last-of-type ${Body} {
    border-bottom: 1px solid #e4e8eb;
  }
`;

export const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1em;
  width: 100%;
  margin: 0;
  padding: 0.5em 0.25em;
  display: flex;
  align-items: center;
  text-transform: inherit;
  color: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  position: relative;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: 2px solid ${colors.orange};
  }

  &::after {
    opacity: 0.5;
    content: "";
    background: url(${chevron});
    display: block;
    position: absolute;
    right: 0.25rem;
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${(props) => (props.open ? "0deg" : "-90deg")});
  }
`;

export const DisplayContent = styled.div`
  display: ${(props) => (props.open ? "block" : "none")};
`;

class Accordion extends Component {
  state = { open: true, height: "auto" };

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title } = this.props;
    const { open } = this.state;
    const kebabTitle = kebabCase(title);
    return (
      <Container>
        <Header>
          <Title>
            <Button
              open={open}
              onClick={this.handleToggle}
              aria-expanded={open}
              aria-controls={`accordion-${kebabTitle}`}
              data-test={`accordion-${kebabTitle}-button`}
            >
              {title}
            </Button>
          </Title>
        </Header>
        <Body
          id={`accordion-${kebabTitle}`}
          data-test={`accordion-${kebabTitle}-body`}
          open={open}
          aria-hidden={!open}
        >
          <DisplayContent open={open}>{children}</DisplayContent>
        </Body>
      </Container>
    );
  }
}

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Accordion;
