import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import { colors, radius } from "constants/theme";
import Collapsible from "components/Collapsible";
import ValidationError from "components/ValidationError";
import { pageDescriptionErrors } from "constants/validationMessages";
import ExternalLink from "components-themed/ExternalLink";

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
  border: thin solid ${colors.grey};
  border-radius: ${radius};
  padding: 0.5em;
  outline: thin solid transparent;
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

const PageTitleInput = ({
  heading,
  onChange,
  onUpdate,
  pageDescription,
  altFieldName,
  error,
}) => (
  <PageTitleContent>
    <Heading data-test="page-title-input-heading">{heading}</Heading>
    <p>
      The page title is the first thing read by screen readers and helps users
      of assistive technology understand what the page is about. It is shown in
      the browser&apos;s title bar or in the page&apos;s tab. Page titles follow
      the structure: &apos;page description - questionnaire title&apos;.
    </p>
    <p>
      For help writing a page description, see our{" "}
      <ExternalLink
        url="https://ons-design-system.netlify.app/guidance/page-titles-and-urls/#page-titles"
        linkText="design system guidance on page titles"
      />
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
    <Field data-test="page-title-missing-error">
      <Label
        data-test="page-title-input-field-label"
        htmlFor={altFieldName ? altFieldName : "pageDescription"}
      >
        Page description
      </Label>
      <StyledInput
        id={altFieldName ? altFieldName : "pageDescription"}
        type="text"
        data-test="txt-page-description"
        autoComplete="off"
        name={altFieldName ? altFieldName : "pageDescription"}
        placeholder=""
        onChange={(e) => onChange(e.target)}
        onBlur={(e) => onUpdate(e.target)}
        value={pageDescription || ""}
        hasError={error}
      />
      {error && (
        <ValidationError>
          {pageDescriptionErrors.PAGE_DESCRIPTION_MISSING}
        </ValidationError>
      )}
    </Field>
  </PageTitleContent>
);

PageTitleInput.propTypes = {
  pageDescription: PropTypes.string,
  heading: PropTypes.string,
  altFieldName: PropTypes.string,
  error: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

PageTitleInput.defaultProps = {
  heading: "Descriptions and definitions",
};

export default PageTitleInput;
