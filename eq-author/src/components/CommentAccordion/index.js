import React, { Component } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Header = styled.div`
  padding-left: 1em;
  color: ${colors.blue};
  text-decoration: underline;
  &:hover {
    /* background: #f3f3f3; */
    color: ${colors.grey};
  }
`;

export const Title = styled.h2`
  font-size: 0.75em;
  letter-spacing: 0.05em;
  vertical-align: middle;

  text-align: left;

  margin: 0;
  padding: 0.5em 0;
  position: relative;
`;

export const Body = styled.div`
  overflow: hidden;
  transition: opacity 100ms ease-in-out;
  opacity: ${props => (props.open ? "1" : "0")};
  height: ${props => (props.open ? "auto" : "0")};
`;

const Container = styled.div`
  /* fixes ghosting issue in Chrome */
  backface-visibility: hidden;
  &:last-of-type ${Body} {
    border-bottom: 1px solid ${colors.lightMediumGrey};
  }
`;

export const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1.2em;
  width: 100%;
  margin: 0;
  padding: 0.5em 0.25em;
  display: flex;
  align-items: center;
  text-transform: inherit;
  color: ${colors.blue};
  letter-spacing: inherit;
  position: relative;
  background: transparent;
  cursor: pointer;

  &:focus {
    outline: 2px solid ${colors.orange};
  }

  &::before {
    content: "";
    background: url(${chevron});
    display: block;
    position: absolute;
    color: ${colors.blue};
    left: -1rem;
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${props => (props.open ? "0deg" : "-90deg")});
  }
`;

export const DisplayContent = styled.div`
  display: ${props => (props.open ? "block" : "none")};
`;

class CommentAccordion extends Component {
  state = { open: false, height: "auto" };

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
              {title} Replies - {!open && "Show"}
              {open && "Hide"}
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

CommentAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default CommentAccordion;
