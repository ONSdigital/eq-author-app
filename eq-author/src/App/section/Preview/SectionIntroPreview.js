/* eslint-disable react/no-danger */
import React from "react";
import styled from "styled-components";

import fragment from "graphql/fragments/section.graphql";

import Error from "components/preview/Error";
import { propType } from "graphql-anywhere";

const Wrapper = styled.div`
  padding: 2em;
  p {
    margin: 0 0 1em;
  }
  p:last-of-type {
    margin-bottom: 0;
  }
  span[data-piped] {
    background-color: #e0e0e0;
    padding: 0 0.125em;
    border-radius: 4px;
    white-space: pre-wrap;
  }
`;

const ContentBlock = styled.div`
  h2 {
    font-size: 1.3em;
    font-weight: bold;
  }
  word-break: break-word;
`;

const TitleBlock = styled.h1`
  font-size: 1.4em;
  margin: 0 0 1em;
  word-break: break-word;
`;

const SectionIntroPreview = ({
  section: { introductionTitle, introductionContent },
}) => (
  <Wrapper>
    <TitleBlock>
      {!introductionTitle ? (
        <Error data-test="no-title">Missing Introduction Title</Error>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: introductionTitle }} />
      )}
    </TitleBlock>
    {!introductionContent ? (
      <Error data-test="no-content" large margin={false}>
        Missing Introduction Content
      </Error>
    ) : (
      <ContentBlock dangerouslySetInnerHTML={{ __html: introductionContent }} />
    )}
  </Wrapper>
);

SectionIntroPreview.propTypes = {
  section: propType(fragment).isRequired,
};

export default SectionIntroPreview;
