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
  margin-top: 1em;
`;

const HubSettings = ({ id, requiredCompleted, showOnHub }) => {

  const [updateSection] = useMutation(updateSectionMutation);
  const defaultOpen = () => requiredCompleted;

  return (
    <Collapsible
        title="Hub settings"
        className="hubSettings"
        defaultOpen={defaultOpen()}
        withoutHideThis
        variant="content"
      >
        <InlineField>
          <Label htmlFor="required-completed">Pre-hub section</Label>
          <ToggleWrapper>
            <ToggleSwitch
              id="required-completed"
              name="required-completed"
              data-test="required-completed"
              hideLabels={false}
              onChange={({ value }) =>
                updateSection({
                  variables: {
                    input: { id, requiredCompleted: value },
                  },
                })
              }
              checked={requiredCompleted}
            />
            </ToggleWrapper>
          </InlineField>
          <Caption>
          The respondent must complete pre-hub sections before they see the &quot;hub&quot;.
        </Caption>
        <EnableDisableWrapper data-test="toggle-wrapper" disabled={!requiredCompleted}>
          <InlineField>
            <Label htmlFor-="show-onHub">Display section in hub</Label>
            <ToggleWrapper>
              <ToggleSwitch
                id="show-onHub"
                name="show-onHub"
                data-test="showOnHub"
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
  requiredCompleted: PropTypes.bool,
  showOnHub: PropTypes.bool,
};

export default HubSettings;
