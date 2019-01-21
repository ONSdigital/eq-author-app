import React from "react";
import { propType } from "graphql-anywhere";
import PropTypes from "prop-types";
import styled from "styled-components";
import { flowRight } from "lodash";
import { connect } from "react-redux";

import { Buttons } from "App/questionPage/Design/EditorToolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import RichTextEditor from "components/RichTextEditor";
import withEntityEditor from "components/withEntityEditor";
import { colors, radius } from "constants/theme";
import withPropRenamed from "enhancers/withPropRenamed";
import { raiseToast } from "redux/toast/actions";
import withChangeUpdate from "enhancers/withChangeUpdate";

import withDeleteSectionIntro from "./withDeleteSectionIntro";
import withUpdateSectionIntro from "./withUpdateSectionIntro";
import fragment from "./SectionIntroductionFragment.graphql";

const IntroToolbar = styled.div`
  border: 1px solid ${colors.bordersLight};
  border-bottom: 0;
  border-radius: ${radius} ${radius} 0 0;
  display: flex;
  padding: 1em 1em 0;
`;

const IntroCanvas = styled.div`
  padding: 0 1em;
  border: 1px solid ${colors.bordersLight};
  border-top: 0;
  background-color: ${colors.white};
  border-radius: 0 0 ${radius} ${radius};
`;

export const UnwrappedIntroEditor = ({
  sectionIntro,
  deleteSectionIntro,
  onChangeUpdate,
}) => (
  <div>
    <IntroToolbar>
      <Buttons>
        <IconButtonDelete
          onClick={() => deleteSectionIntro(sectionIntro)}
          data-test="btn-delete"
          iconText="Delete Introduction"
        />
      </Buttons>
    </IntroToolbar>
    <IntroCanvas>
      <RichTextEditor
        id="introduction-title"
        label="Introduction title"
        name="introductionTitle"
        onUpdate={onChangeUpdate}
        size="large"
        testSelector="txt-introduction-title"
        value={sectionIntro.introductionTitle}
        controls={{ piping: true }}
      />
      <RichTextEditor
        id="introduction-content"
        label="Introduction content"
        onUpdate={onChangeUpdate}
        name="introductionContent"
        multiline
        testSelector="txt-introduction-content"
        value={sectionIntro.introductionContent}
        controls={{
          heading: true,
          bold: true,
          list: true,
          piping: true,
          emphasis: true,
        }}
      />
    </IntroCanvas>
  </div>
);

UnwrappedIntroEditor.propTypes = {
  sectionIntro: propType(fragment).isRequired,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  deleteSectionIntro: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

const wrappedSectionIntro = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withDeleteSectionIntro,
  withUpdateSectionIntro,
  withPropRenamed("updateSectionIntro", "onUpdate"),
  withEntityEditor("sectionIntro", fragment),
  withChangeUpdate
)(UnwrappedIntroEditor);

export default wrappedSectionIntro;
