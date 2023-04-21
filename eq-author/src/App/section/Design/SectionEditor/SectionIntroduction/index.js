import React from "react";
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
  const { id, hasIntroduction } = section;
  const [updateSection] = useMutation(UPDATE_SECTION_MUTATION);

  return (
    <>
      <Label>Section introduction page</Label>
      <CollapsibleToggled
        quoted={false}
        withContentSpace
        onChange={({ value }) =>
          updateSection({
            variables: { input: { id, hasIntroduction: value } },
          })
        }
        isOpen={hasIntroduction}
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
