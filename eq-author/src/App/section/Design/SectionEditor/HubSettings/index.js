import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Label } from "components/Forms";
import Collapsible from "components/Collapsible";

import Property from "../../../../page/PropertiesPanel/QuestionProperties/Property";

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.45em;
  margin-left: 1em;
  font-size: 0.85em;
`;

const HubSettings = ({ preHubEnabled=false }) => {

  const handleChange = () => {
    return null;
  };
  // const handleChange = ({ name, value }) => {
  //   const { page, onUpdateQuestionPage } = this.props;

  //   onUpdateQuestionPage({
  //     ...page,
  //     [name]: value,
  //   });
  // };

  const defaultOpen = () =>
      preHubEnabled;
  //     || displaySectionInHubEnabled;

  return (
    <Collapsible
        title="Hub settings"
        className="hubSettings"
        defaultOpen={defaultOpen()}
        withoutHideThis
        variant="content"
      >
        <Property
          id="preHub"
          data-test="preHubEnabled"
          checked={preHubEnabled}
          onChange={handleChange}
        >
          <Label>Pre-hub section</Label>
        </Property>
        <Caption>
          The respondent must complete pre-hub sections before they see the &quot;hub&quot;.
        </Caption>

        {/* <AdditionalContentOptions
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
          option={"description"}
        /> */}
        
      </Collapsible>
  );
};

HubSettings.propTypes = {
  match: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default HubSettings;
