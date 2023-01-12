import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const IconContainer = styled.span`
  visibility: hidden;
  white-space: nowrap;
`;

const ExternalIcon = styled.svg`
  vertical-align: middle;
  width: 1rem;
  height: 1rem;
  padding-bottom: 0.1rem;
  margin: 0 0 0 0.25rem;
  visibility: visible;
`;

const VisualHidden = styled.span`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 1px;
`;

const ExternalLink = ({ url, linkText }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      data-test="external-link-href"
    >
      <span data-test="external-link-text">{linkText}</span>
      <IconContainer>
        &nbsp;
        <ExternalIcon
          id="external-link"
          viewBox="0 0 12 12"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5,9H13a.5.5,0,0,0-.5.5v3h-9v-9h3A.5.5,0,0,0,7,3V2.5A.5.5,0,0,0,6.5,2h-4a.5.5,0,0,0-.5.5v11a.5.5,0,0,0,.5.5h11a.5.5,0,0,0,.5-.5v-4A.5.5,0,0,0,13.5,9Z"
            transform="translate(-2 -1.99)"
          />
          <path
            d="M8.83,7.88a.51.51,0,0,0,.71,0l2.31-2.32,1.28,1.28A.51.51,0,0,0,14,6.49v-4a.52.52,0,0,0-.5-.5h-4A.51.51,0,0,0,9,2.52a.58.58,0,0,0,.14.33l1.28,1.28L8.12,6.46a.51.51,0,0,0,0,.71Z"
            transform="translate(-2 -1.99)"
          />
        </ExternalIcon>
      </IconContainer>
      <VisualHidden data-test="external-link-screen-reader-text">
        {" "}
        (opens in a new tab)
      </VisualHidden>
    </a>
  );
};

ExternalLink.propTypes = {
  url: PropTypes.string.isRequired,
  linkText: PropTypes.string.isRequired,
};

export default ExternalLink;
