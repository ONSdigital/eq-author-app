import React from "react";
import styled from "styled-components";
import SubmissionLayout from "../SubmissionLayout";

import { colors } from "constants/theme";
import PageTitle from "components/preview/elements/PageTitle";
import Panel from "components-themed/panels";

const Padding = styled.div`
  padding: 2em;
`;

const Preview = () => {
  return (
    <SubmissionLayout>
      <Padding>
        <Panel variant="success" withLeftBorder>
          <PageTitle>Thank you for completing the survey</PageTitle>
        </Panel>
      </Padding>
    </SubmissionLayout>
  );
};

export default Preview;
