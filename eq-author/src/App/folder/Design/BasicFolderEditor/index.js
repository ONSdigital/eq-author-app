import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import Collapsible from "components/Collapsible";

const Guidance = styled(Collapsible)`
  margin-left: 2em;
  margin-right: 2em;
`;

const Title = styled.h2``;

const Content = styled.p``;

const BasicFolderEditor = ({ folderId }) => {
  return (
    <>
      <Title>Folders</Title>
      <Content>
        Folders are used to apply an action or event to multiple questions at
        once. Respondents do not see the folders.
      </Content>
      <Guidance
        title="What is the benefit of using folders?"
        key={`guidance-folder-${folderId}`}
      >
        <Content>
          Folders are groups of related questions. Logic can be applied to the
          whole folder or each question within the folder, they allow you to
          build more complex navigation in your questionnaire.
        </Content>
        <Content>
          Folders do not appear as sections when respondents are completing the
          questionnaire; respondents only see the questions contained within
          folders if they meet the conditions you have applied.
        </Content>
      </Guidance>
    </>
  );
};

BasicFolderEditor.propTypes = {
  folderId: PropTypes.string,
};

export default BasicFolderEditor;
