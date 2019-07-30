import React from "react";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import PropTypes from "prop-types";
import { flowRight } from "lodash";

import Button from "components/buttons/Button";
import Reorder from "components/Reorder";

import Transition from "./Transition";
import withCreateCollapsible from "./withCreateCollapsible";
import CollapsibleEditor from "./CollapsibleEditor";
import withMoveCollapsible from "./withMoveCollapsible";

const AddButton = styled(Button)`
  width: 100%;
`;

export const CollapsiblesEditor = ({
  collapsibles,
  createCollapsible,
  moveCollapsible,
  introductionId,
}) => (
  <div>
    <Reorder
      list={collapsibles}
      onMove={moveCollapsible}
      Transition={Transition}
      data-test="collapsibles-list"
    >
      {(props, collapsible) => (
        <CollapsibleEditor {...props} collapsible={collapsible} />
      )}
    </Reorder>
    <AddButton
      variant="secondary"
      onClick={() => createCollapsible({ introductionId })}
      data-test="add-collapsible-btn"
    >
      Add collapsible
    </AddButton>
  </div>
);

CollapsiblesEditor.fragments = [...CollapsibleEditor.fragments];

CollapsiblesEditor.propTypes = {
  collapsibles: PropTypes.arrayOf(propType(CollapsibleEditor.fragments[0]))
    .isRequired,
  createCollapsible: PropTypes.func.isRequired,
  moveCollapsible: PropTypes.func.isRequired,
  introductionId: PropTypes.string.isRequired,
};

export default flowRight(
  withCreateCollapsible,
  withMoveCollapsible
)(CollapsiblesEditor);
