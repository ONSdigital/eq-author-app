import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Header = styled.div`
  padding: 0 0 0.5em;

  --color-text: rgb(255, 255, 255);
  text-decoration: none;
  &:hover {
    color: ${colors.grey};
  }
`;

export const Title = styled.div`
  font-size: 0.75em;
  letter-spacing: 0.05em;
  vertical-align: middle;
  text-align: left;
  margin: 0;
  display: flex;
`;

export const Body = styled.div`
  padding-left: 1.85em;
  overflow: hidden;
  transition: opacity 200ms ease-in-out;
  opacity: ${(props) => (props.isOpen ? "1" : "0")};
  height: ${(props) => (props.isOpen ? "auto" : "0")};
`;

export const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1.2em;
  margin: 0;
  text-transform: inherit;
  color: ${colors.white};
  letter-spacing: inherit;
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
    width: 1rem;
    height: 1rem;
    transform-origin: 50% 50%;
    transition: transform 200ms ease-out;
    transform: rotate(${(props) => (props.isOpen ? "0deg" : "-90deg")});
  }
`;

export const SectionTitle = styled.div`
  appearance: none;
  border: none;
  font-size: 1.2em;
  width: 100%;
  margin: 0;

  text-transform: inherit;
  color: ${colors.white};
  letter-spacing: inherit;
  position: relative;
  background: transparent;
  cursor: pointer;
  text-align: left;
  min-width: 0;

  &:focus {
    outline: none;
  }
`;

export const DisplayContent = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
`;

const propTypes = {
  SectionAccordion: {
    title: PropTypes.func.isRequired,
    titleName: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    identity: PropTypes.number,
    handleChange: PropTypes.func,
    isOpen: PropTypes.shape({ open: PropTypes.bool }).isRequired,
  },
};

const SectionAccordion = (props) => {
  const [isOpen, setIsOpen] = useState(true);

  const {
    children,
    title,
    titleName,
    isOpen: isOpenProp,
    handleChange,
    identity,
  } = props;

  useEffect(() => {
    setIsOpen(isOpenProp.open);
  }, [isOpenProp]);

  const handleClick = () => {
    setIsOpen((isOpen) => !isOpen);
    handleChange({ isOpen: !isOpen, id: identity });
  };

  const onEnterUp = (event) => {
    if (event.keyCode === 13 || event.keyCode === 32) {
      setIsOpen((isOpen) => !isOpen);
      handleChange({ isOpen: !isOpen, id: identity });
    }
  };

  return (
    <>
      <Header>
        <Title
          onKeyUp={(event) => onEnterUp(event)}
          data-test={`accordion-${titleName}-titleContainer`}
        >
          <Button
            role="button"
            id={`${titleName}-btn`}
            isOpen={isOpen}
            onClick={() => handleClick()}
            aria-expanded={isOpen}
            aria-controls={`accordionBody-${titleName}`}
            data-test={`accordion-${titleName}-button`}
            tabIndex={-1}
          />
          <SectionTitle data-test={`accordion-${titleName}-title`}>
            {title(isOpen)}
          </SectionTitle>
        </Title>
      </Header>
      <Body
        role="region"
        id={`accordionBody-${titleName}`}
        data-test={`accordion-${titleName}-body`}
        isOpen={isOpen}
        aria-hidden={!isOpen}
        hidden={!isOpen}
        aria-labelledby={`${titleName}-title`}
      >
        <DisplayContent isOpen={isOpen}>{children}</DisplayContent>
      </Body>
    </>
  );
};

SectionAccordion.propTypes = propTypes.SectionAccordion;

export default SectionAccordion;
