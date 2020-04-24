import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Header = styled.div`
  padding: 0 0 0.3em 1.2em;
  --color-text: rgb(255, 255, 255);
  text-decoration: none;
  &:hover {
    color: ${colors.grey};
  }
`;

export const Title = styled.h2`
  font-size: 0.75em;
  letter-spacing: 0.05em;
  vertical-align: middle;
  text-align: left;
  margin: 0;
  /* padding: 0.5em 0; */
  position: relative;
`;

export const Body = styled.div`
  padding-left: 1.2em;
  overflow: hidden;
  transition: opacity 200ms ease-in-out;
  opacity: ${props => (props.isOpen ? "1" : "0")};
  height: ${props => (props.isOpen ? "auto" : "0")};
`;

export const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1.2em;
  /* width: 100%; */
  margin: 0;
  display: flex;
  /* align-items: center; */
  text-transform: inherit;
  color: ${colors.white};
  letter-spacing: inherit;
  position: relative;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:focus {
    outline: none;
  }

  &::before {
    content: "";
    background: url(${chevron});
    display: block;
    position: absolute;
    left: -1rem;
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${props => (props.isOpen ? "0deg" : "-90deg")});
  }
`;

export const SectionTitle = styled.div`
  appearance: none;
  border: none;
  font-size: 1.2em;
  width: 100%;
  margin: 0;
  /* display: flex; */
  /* align-items: center; */
  text-transform: inherit;
  color: ${colors.white};
  letter-spacing: inherit;
  position: relative;
  background: transparent;
  cursor: pointer;
  text-align: left;

  &:focus {
    outline: none;
  }
`;

export const DisplayContent = styled.div`
  display: ${props => (props.isOpen ? "block" : "none")};
`;

class SectionAccordion extends Component {
  state = { isOpen: true, height: "auto" };

  handleToggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const { children, title } = this.props;
    const { isOpen } = this.state;
    // const replyTitle = title > 1 ? " replies" : " reply";

    return (
      <>
        <Header>
          <Title>
            <Button
              isOpen={isOpen}
              onClick={this.handleToggle}
              aria-expanded={isOpen}
              aria-controls={`accordion-${title}`}
              data-test={`accordion-${title}-button`}
            >
              {}
            </Button>
            <SectionTitle
              // isOpen={isOpen}
              // onClick={this.handleToggle}
              aria-expanded={isOpen}
              aria-controls={`accordion-${title}`}
              data-test={`accordion-${title}-button`}
            >
              {title}
            </SectionTitle>
          </Title>
        </Header>
        <Body
          id={`accordion-${title}`}
          data-test={`accordion-${title}-body`}
          isOpen={isOpen}
          aria-hidden={!isOpen}
        >
          <DisplayContent isOpen={isOpen}>{children}</DisplayContent>
        </Body>
      </>
    );
  }
}

SectionAccordion.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export default SectionAccordion;
