import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import { get, flowRight } from "lodash";

import RichTextEditor from "components/RichTextEditor";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withValidationError from "enhancers/withValidationError";

import pageFragment from "graphql/fragments/page.graphql";
import { getMultipleErrorsByField } from "./validationUtils.js";

import { enableOn } from "utils/featureFlags";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelect/content-types";

const titleControls = {
  emphasis: true,
  piping: true,
};

export class StatelessMetaEditor extends React.Component {
  description = React.createRef();
  guidance = React.createRef();

  errorMsg = (field) =>
    getMultipleErrorsByField(field, this.props.page.validationErrorInfo.errors);

  render() {
    const { page, onChangeUpdate, fetchAnswers, allCalculatedSummaryPages } =
      this.props;

    return (
      <div>
        <RichTextEditor
          id="question-title"
          name="title"
          label="Question"
          placeholder=""
          value={page.title}
          onUpdate={onChangeUpdate}
          controls={titleControls}
          size="large"
          fetchAnswers={fetchAnswers}
          metadata={get(page, "section.questionnaire.metadata", [])}
          testSelector="txt-question-title"
          pageType={page.pageType}
          allowableTypes={
            enableOn(["pipeCalculatedSummary"])
              ? [ANSWER, METADATA, VARIABLES]
              : [ANSWER, METADATA]
          }
          defaultTab="variables"
          autoFocus={!page.title}
          allCalculatedSummaryPages={allCalculatedSummaryPages}
          errorValidationMsg={this.errorMsg("title")}
        />
      </div>
    );
  }
}

StatelessMetaEditor.propTypes = {
  fetchAnswers: PropTypes.func.isRequired,
  page: propType(pageFragment).isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
};

StatelessMetaEditor.fragments = {
  Page: pageFragment,
};

export default flowRight(
  withValidationError("page"),
  withChangeUpdate
)(StatelessMetaEditor);
