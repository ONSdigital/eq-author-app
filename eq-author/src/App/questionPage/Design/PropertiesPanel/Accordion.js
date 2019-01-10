import React, { Component } from "react";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Container = styled.div``;

const Header = styled.div`
  background: #f8f8f8;
  padding: 0 0.25em;
  border-top: 1px solid #e4e8eb;
  border-bottom: 1px solid #e4e8eb;
  &:hover {
    background: #f3f3f3;
  }
`;

export const Title = styled.h2`
  font-size: 12px;
  letter-spacing: 0.05em;
  vertical-align: middle;
  color: #4a4a4a;
  text-align: left;
  text-transform: uppercase;
  margin: 0;
  padding: 0.5em 0;
  position: relative;
`;

const Body = styled.div`
  overflow: hidden;
  transition: opacity 100ms ease-in-out;
  opacity: ${props => (props.open ? "1" : "0")};
  height: ${props => (props.open ? "auto" : "0")};
`;

const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1em;
  display: block;
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
    transform: rotate(${props => (props.open ? "0deg" : "-90deg")});
  }
`;

class Accordion extends Component {
  state = { open: true, height: "auto" };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  render() {
    const { children, title } = this.props;
    const { open } = this.state;

    return (
      <Container>
        <Header>
          <Title>
            <Button open={open} onClick={this.handleToggle}>
              {title}
            </Button>
          </Title>
        </Header>

        <Body open={open}>{children}</Body>
      </Container>
    );
  }
}

export default Accordion;
