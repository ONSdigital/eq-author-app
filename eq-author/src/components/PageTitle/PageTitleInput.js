import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Input, Label } from "components/Forms";
import { colors } from "constants/theme";
import Collapsible from "components/Collapsible";

const PageTitleContent = styled.div`
  color: ${colors.black};
`;

const Heading = styled.h2`
  font-size: 1em;
  font-weight: bold;
  line-height: 1.3em;
  margin-bottom: 0.4em;
`;

const StyledInput = styled.input`
  width: 100%;
  font-size: 1em;
  color: ${colors.black};
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

const PageTitleInput = ({ onChange, onUpdate, pageDescription }) => (
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
      <Label htmlFor="pageDescription">Page description</Label>
      <StyledInput
        id="pageDescription"
        type="text"
        data-test="txt-page-description"
        autoComplete="off"
        name="pageDescription"
        placeholder=""
        onChange={(e) => onChange(e.target)}
        onBlur={(e) => onUpdate(e.target)}
        value={pageDescription || ""}
      />
    </Field>
  </PageTitleContent>
);

PageTitleInput.propTypes = {
  pageDescription: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PageTitleInput;
