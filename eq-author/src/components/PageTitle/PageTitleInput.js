import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import { colors, radius } from "constants/theme";
import ValidationError from "components/ValidationError";
// import ExternalLink from "components-themed/ExternalLink";

import PasteModal from "components/modals/PasteModal";
import { reduceMultipleSpaces } from "utils/reduceMultipleSpaces";

const PageTitleContent = styled.div`
  color: ${colors.black};
`;

const Heading = styled.h2`
  font-size: 1em;
  font-weight: bold;
  line-height: 1.3em;
  margin-bottom: 0.4em;
`;

const PageDescriptionContent = styled.div`
  margin-bottom: 1.3em;
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

const PageTitleInput = ({
  heading,
  onChange,
  onUpdate,
  pageDescription,
  inputTitlePrefix,
  altFieldName,
  errorMessage,
}) => {
  const [showPasteModal, setShowPasteModal] = useState({
    show: false,
    text: "",
    event: {},
  });

  const handleChange = (e) => {
    e.target.value = e.target.value.replace(/\n/g, " ");
    e.target.value = e.target.value.replace(/\s+/g, " ");
    onChange(e.target);
  };

  const handlePaste = (event) => {
    const text = event.clipboardData.getData("text");
    event.persist();
    if (/\s{2,}/g.test(text)) {
      setShowPasteModal({
        show: true,
        text: text,
        event: event,
      });
    }
  };

  const updateOnPaste = () => {
    const { text, event } = showPasteModal;
    if (event && event.persist) {
      const target = event.target;
      const cursorPosition = target.selectionStart;
      const currentValue = target.value;

      // Insert the pasted text at the cursor position
      const newValue =
        currentValue.substring(0, cursorPosition) +
        reduceMultipleSpaces(text) +
        currentValue.substring(target.selectionEnd);

      const updatedEvent = { ...event, persist: undefined }; // Create a new event without the persist method
      updatedEvent.target.value = newValue;

      onChange(updatedEvent.target);
    }

    // Clear the showPasteModal state
    setShowPasteModal({ show: false, text: "" });
  };

  const cancelPaste = () => {
    setShowPasteModal({ show: false, text: "" });
  };
  return (
    <PageTitleContent>
      <PasteModal
        isOpen={showPasteModal.show}
        onConfirm={updateOnPaste}
        onCancel={cancelPaste}
      />
      <Heading data-test="page-title-input-heading">{heading}</Heading>
      <PageDescriptionContent>
        The page title is the first thing read by screen readers and helps users
        of assistive technology understand what the page is about. It is shown
        in the browser&apos;s title bar or in the page&apos;s tab. Page titles
        follow the structure: &apos;page description - questionnaire
        title&apos;.
      </PageDescriptionContent>
      {/* From interaction designer - this will be brought back when the page titles link is fixed */}
      {/* <p>
        For help writing a page description, see our{" "}
        <ExternalLink
          url="https://ons-design-system.netlify.app/guidance/page-titles-and-urls/#page-titles"
          linkText="design system guidance on page titles"
        />
      </p> */}
      <Field data-test="page-title-missing-error">
        <Label
          data-test="page-title-input-field-label"
          htmlFor={altFieldName ? altFieldName : "pageDescription"}
        >
          {inputTitlePrefix
            ? `${inputTitlePrefix} page description`
            : "Page description"}
        </Label>
        <StyledInput
          id={altFieldName ? altFieldName : "pageDescription"}
          type="text"
          data-test="txt-page-description"
          autoComplete="off"
          name={altFieldName ? altFieldName : "pageDescription"}
          placeholder=""
          onPaste={(e) => handlePaste(e)}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => onUpdate(e.target)}
          value={pageDescription || ""}
          hasError={errorMessage}
        />
        {errorMessage && <ValidationError>{errorMessage}</ValidationError>}
      </Field>
    </PageTitleContent>
  );
};

PageTitleInput.propTypes = {
  pageDescription: PropTypes.string,
  inputTitlePrefix: PropTypes.string,
  heading: PropTypes.string,
  altFieldName: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

PageTitleInput.defaultProps = {
  heading: "Page title and description",
};

export default PageTitleInput;
