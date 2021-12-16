import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import RichTextEditor from "components/RichTextEditor";

import { noop } from "lodash/fp";

// import EditorLayout from "components/EditorLayout";

// import Panel from "components/Panel";

const Padding = styled.div`
  padding: 2em;
`;

const Section = styled.section`
  &:not(:last-of-type) {
    border-bottom: 1px solid #e0e0e0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 1em;
`;

const SectionDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${colors.textLight};
`;

// TODO: Piping answer
const contentControls = {
  heading: true,
  bold: true,
  emphasis: true,
  piping: true,
  list: true,
  link: true,
};

const title = "Test";

const SubmissionEditor = () => {
  return (
    <>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Page content
          </SectionTitle>
          <SectionDescription>
            Uneditable content is not listed in the design view of this page. To
            view all content, including uneditable content, use preview.
          </SectionDescription>
          <RichTextEditor
            id="submission-further-content"
            name="submissionFurtherContent"
            label="Further content"
            value={title}
            controls={contentControls}
            size="large"
            onUpdate={noop}
            testSelector="txt-submission-further-content"
          />
        </Padding>
      </Section>
    </>
  );
};

SubmissionEditor.propTypes = {
  // children: PropTypes.node.isRequired,
  renderPanel: PropTypes.func,
};

export default SubmissionEditor;
