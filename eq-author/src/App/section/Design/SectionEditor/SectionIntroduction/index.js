import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";

import { Label } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import CollapsibleToggled from "components/CollapsibleToggled";
import PageTitleContainer from "components/PageTitle";

import UPDATE_SECTION_MUTATION from "graphql/updateSection.graphql";

const SectionIntroduction = ({
  section,
  handleUpdate,
  introductionTitleErrorMessage,
  introductionContentErrorMessage,
}) => {
  const {
    id,
    introductionPageDescription,
    introductionEnabled,
    validationErrorInfo,
  } = section;
  const { errors } = validationErrorInfo;

  const [updateSection] = useMutation(UPDATE_SECTION_MUTATION);

  const [pageDescription, setPageDescription] = useState(
    introductionPageDescription
  );

  return (
    <>
      <Label htmlFor={"section-introduction-toggle"}>
        Section introduction page
      </Label>
      <CollapsibleToggled
        id={"section-introduction-toggle"}
        quoted={false}
        withContentSpace
        onChange={({ value }) =>
          updateSection({
            variables: { input: { id, introductionEnabled: value } },
          })
        }
        isOpen={introductionEnabled}
      >
        <RichTextEditor
          id="introduction-title"
          label="Introduction title"
          name="introductionTitle"
          onUpdate={handleUpdate}
          size="large"
          testSelector="txt-introduction-title"
          value={section?.introductionTitle}
          controls={{ piping: true }}
          listId={section?.repeatingSectionListId ?? null}
          errorValidationMsg={introductionTitleErrorMessage}
        />
        <RichTextEditor
          id="introduction-content"
          label="Introduction content"
          multiline
          onUpdate={handleUpdate}
          name="introductionContent"
          testSelector="txt-introduction-content"
          value={section?.introductionContent}
          controls={{
            heading: true,
            bold: true,
            list: true,
            piping: true,
            emphasis: true,
            link: true,
          }}
          listId={section?.repeatingSectionListId ?? null}
          errorValidationMsg={introductionContentErrorMessage}
        />
        <PageTitleContainer
          heading="Section introduction page title"
          pageDescription={pageDescription}
          inputTitlePrefix="Section introduction"
          onChange={({ value }) => {
            setPageDescription(value);
          }}
          onUpdate={({ value }) => {
            updateSection({
              variables: { input: { id, introductionPageDescription: value } },
            });
          }}
          altFieldName={"sectionIntroductionPageDescription"}
          altError={"SECTION_INTRODUCTION_PAGE_DESCRIPTION_MISSING"}
          errors={errors}
        />
      </CollapsibleToggled>
    </>
  );
};

SectionIntroduction.propTypes = {
  section: CustomPropTypes.section.isRequired,
  handleUpdate: PropTypes.func.isRequired,
  introductionTitleErrorMessage: PropTypes.string,
  introductionContentErrorMessage: PropTypes.string,
};

export default SectionIntroduction;
