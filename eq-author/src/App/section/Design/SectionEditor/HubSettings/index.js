import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field, Label } from "components/Forms";
import updateSectionMutation from "graphql/updateSection.graphql";
import { useMutation } from "@apollo/react-hooks";

import Collapsible from "components/Collapsible";
import ToggleSwitch from "components/buttons/ToggleSwitch";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  margin-left: 1em;

  > * {
    margin-bottom: 0;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  margin-left: 11em;
  position: absolute;
  margin-top: -0.3em;
`;

const Caption = styled.p`
  margin-top: 0.2em;
  margin-bottom: 0.45em;
  margin-left: 1em;
  font-size: 0.85em;
`;

const EnableDisableWrapper = styled.div`
  opacity: ${(props) => (props.disabled ? "0.6" : "1")};
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;

const HubSettings = ({ id, preHubEnabled=false, showOnHub }) => {

  console.log('preHubEnabled :>> ', preHubEnabled);
  
  const [updateSection] = useMutation(updateSectionMutation);


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
        <InlineField>
          <Label>Pre-hub section</Label>
          <ToggleWrapper>
            <ToggleSwitch
              id="preHubEnabled"
              name="preHubEnabled"
              hideLabels={false}
              onChange={({ value }) =>
                updateSection({
                  variables: {
                    input: { id, requiredCompleted: value },
                  },
                })
              }
              checked={preHubEnabled}
            />
            </ToggleWrapper>
          </InlineField>
          <Caption>
          The respondent must complete pre-hub sections before they see the &quot;hub&quot;.
        </Caption>
        <EnableDisableWrapper disabled={!preHubEnabled}>
          <InlineField>
            <Label>Display section in hub</Label>
            <ToggleWrapper>
              <ToggleSwitch
                id="showOnHub"
                name="showOnHub"
                hideLabels={false}
                onChange={({ value }) =>
                updateSection({
                    variables: {
                      input: { id, showOnHub: value },
                    },
                  })
                }
                checked={showOnHub}
              />
            </ToggleWrapper>
          </InlineField>
        </EnableDisableWrapper>
        <Caption>
          You can choose to show this section in the &quot;hub&quot; so respondents could review their answers.
        </Caption>
      </Collapsible>
  );
};

HubSettings.propTypes = {
  id: PropTypes.string.isRequired,
  preHubEnabled: PropTypes.bool.isRequired,
  showOnHub: PropTypes.bool.isRequired,
};

export default HubSettings;
