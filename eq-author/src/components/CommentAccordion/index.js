import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import chevron from "./icon-chevron.svg";

const Header = styled.div`
  padding-left: 1em;
  color: ${colors.blue};
`;

export const Title = styled.h2`
  font-size: 0.85em;
  font-weight: normal;
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
  opacity: ${props => (props.isOpen ? "1" : "0")};
  height: ${props => (props.isOpen ? "auto" : "0")};
`;

export const Button = styled.button`
  appearance: none;
  border: none;
  font-size: 1.05em;
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
  text-decoration: underline;

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
    transform: rotate(${props => (props.isOpen ? "0deg" : "-90deg")});
  }
`;

const ReplyInProgress = styled.label`
  padding: 0 0.25em;
  color: ${colors.grey};
`;

export const replyInProgress = "Reply in progress";

const CommentAccordion = ({
  children,
  title,
  isOpen,
  setIsOpen,
  inProgress,
}) => (
  <>
    <Header>
      <Title>
        <Button
          isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={`accordion-${title}`}
          data-test={`accordion-${title}-button`}
        >
          {`${isOpen ? "Hide" : "Show"} ${title} ${
            title > 1 ? " replies" : " reply"
          } `}
        </Button>
        {inProgress && !isOpen && (
          <ReplyInProgress>{replyInProgress}</ReplyInProgress>
        )}
      </Title>
    </Header>
    <Body
      id={`accordion-${title}`}
      data-test={`accordion-${title}-body`}
      isOpen={isOpen}
      aria-hidden={!isOpen}
    >
      {isOpen && <>{children}</>}
    </Body>
  </>
);

CommentAccordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
};

export default CommentAccordion;
