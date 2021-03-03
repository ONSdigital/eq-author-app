import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { compact, isFunction } from "lodash";

import PillTabs from "components/PillTabs";

import * as entityTypes from "constants/validation-entity-types";

export const Pills = styled(PillTabs)`
  width: 5em;
`;

const PillTabContent = styled.div`
  margin-top: 3em;
  margin-bottom: 0;
  width: 100%;
`;

export const ValidationPills = ({
  entityType,
  onEntityTypeChange,
  PreviousAnswer,
  Metadata,
  Now,
  Custom,
  ...rest
}) => {
  const handleOnChange = (value) =>
    onEntityTypeChange({ name: "entityType", value });

  return (
    <Pills
      value={entityType}
      onChange={handleOnChange}
      options={compact([
        isFunction(Now)
          ? {
              id: "Now",
              title: "Start date",
              render: () => (
                <PillTabContent>
                  <Now {...rest} />
                </PillTabContent>
              ),
            }
          : null,
        isFunction(PreviousAnswer)
          ? {
              id: "PreviousAnswer",
              title: "Previous answer",
              render: () => (
                <PillTabContent>
                  <PreviousAnswer {...rest} />
                </PillTabContent>
              ),
            }
          : null,
        isFunction(Metadata)
          ? {
              id: "Metadata",
              title: "Metadata",
              render: () => (
                <PillTabContent>
                  <Metadata {...rest} />
                </PillTabContent>
              ),
            }
          : null,
        isFunction(Custom)
          ? {
              id: "Custom",
              title: "Custom",
              render: () => (
                <PillTabContent>
                  <Custom {...rest} />
                </PillTabContent>
              ),
            }
          : null,
      ])}
    />
  );
};

ValidationPills.propTypes = {
  entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired,
  onEntityTypeChange: PropTypes.func.isRequired,
  PreviousAnswer: PropTypes.func,
  Metadata: PropTypes.func,
  Custom: PropTypes.func,
  Now: PropTypes.func,
};
