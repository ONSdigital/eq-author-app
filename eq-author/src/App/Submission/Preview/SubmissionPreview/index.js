import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import PageTitle from "components/preview/elements/PageTitle";
import Panel from "components-themed/panels";

const Padding = styled.div`
  padding: 2em;
`;

const TitleWrapper = styled.div`
  margin-top: -0.35em;
`;

const SubmissionEditor = ({ submission }) => {
  const { furtherContent, viewPrintAnswers, emailConfirmation, feedback } =
    submission;

  const pageTitle = "Thank you for completing the survey";

  return (
    <Padding>
      <Panel variant="success" withLeftBorder>
        <TitleWrapper>
          <PageTitle title={pageTitle} missingText="Missing title text" />
        </TitleWrapper>
      </Panel>
    </Padding>
  );
};

SubmissionEditor.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    furtherContent: PropTypes.string,
    viewPrintAnswers: PropTypes.bool,
    emailConfirmation: PropTypes.bool,
    feedback: PropTypes.bool,
  }),
  renderPanel: PropTypes.func,
};

export default SubmissionEditor;
