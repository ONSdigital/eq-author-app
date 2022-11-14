import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Input, Label } from "components/Forms";

import { colors } from "constants/theme";

import Collapsible from "components/Collapsible";

const PageTitleContainerWithoutCollapsible = styled.div``;

const PageTitleContainerWithCollapsible = styled.div`
  margin-left: 1em;
  margin-right: 1em;
`;

const PageTitleContent = styled.div`
  color: ${colors.black};
`;

const Heading = styled.h2`
  font-size: 1em;
  font-weight: bold;
  line-height: 1.3em;
  margin-bottom: 0.4em;
`;

const StyledInput = styled(Input)`
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    &:focus,
    &:focus-within {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
      box-shadow: 0 0 0 2px ${colors.errorPrimary};
    }
    &:hover {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
    }
  `}
`;

const Justification = styled(Collapsible)`
  margin-bottom: 1em;
`;

const PageTitleInput = (props) => {
  const { inCollapsible, pageDescriptionValue } = props;

  const [pageDescription, setPageDescription] = useState(pageDescriptionValue);

  const PageTitleContainer = () => (
    <PageTitleContent>
      <Heading>Descriptions and definitions</Heading>
      <p>
        The page description is the first part of the page title. Page titles
        follow the structure: ‘page description – questionnaire title’.
      </p>
      <p>
        For help writing a page description, see our{" "}
        <a
          href="https://ons-design-system.netlify.app/guidance/page-titles-and-urls/#page-titles"
          target="_blank"
          rel="noopener noreferrer"
        >
          design system guidance on page titles
        </a>
        .
      </p>
      <Justification
        title="Why do I need a page description?"
        key={`justification-pagetitle`}
      >
        <p>
          The page title is the first thing read out to those using a screen
          reader and helps users identify the purpose of the page. You can see
          page titles in the tab at the top of your browser.
        </p>
      </Justification>
      <Field>
        <Label htmlFor="pageDescriptionValue">Page description</Label>
        <StyledInput
          id="pageDescriptionValue"
          value={pageDescription}
          onChange={({ value }) => setPageDescription(value)}
          data-test="txt-page-description"
        />
      </Field>
    </PageTitleContent>
  );

  if (inCollapsible) {
    return (
      <Collapsible
        title="Page description"
        className="pageDescriptionCollapsible"
        defaultOpen
        withoutHideThis
        variant="content"
      >
        <PageTitleContainerWithCollapsible>
          <PageTitleContainer />
        </PageTitleContainerWithCollapsible>
      </Collapsible>
    );
  }
  return (
    <PageTitleContainerWithoutCollapsible>
      <PageTitleContainer />
    </PageTitleContainerWithoutCollapsible>
  );
};

PageTitleInput.propTypes = {
  inCollapsible: PropTypes.bool,
  pageDescriptionValue: PropTypes.string,
};

export default PageTitleInput;
