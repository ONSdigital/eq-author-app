import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import { Label } from "components/Forms";
import RichTextEditor from "components/RichTextEditor";
import DescribedText from "components/DescribedText";

import { colors, radius } from "constants/theme";

const IntroCanvas = styled.div`
  padding: 1.5em 1.5em 0;
  border: 1px solid ${colors.bordersLight};
  background-color: ${colors.white};
  border-radius: ${radius} ${radius};
`;

const SectionIntroduction = ({
  section,
  handleUpdate,
  introductionTitleErrorMessage,
  introductionContentErrorMessage,
}) => {
  return (
    <>
      <Label>
        <DescribedText description="If you do not want an introduction page, leave these blank">
          Section introduction page
        </DescribedText>
      </Label>
      <IntroCanvas>
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
      </IntroCanvas>
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
