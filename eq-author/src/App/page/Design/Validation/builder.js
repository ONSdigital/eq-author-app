import { flowRight } from "lodash/fp";

import withToggleAnswerValidation from "./withToggleAnswerValidation";
import withUpdateAnswerValidation from "./withUpdateAnswerValidation";
import withEntityEditor from "components/withEntityEditor";

import withAnswerValidation from "./withAnswerValidation";
import Validation from "./Validation";
import withProps from "enhancers/withProps";
import withPropRenamed from "enhancers/withPropRenamed";
import withPropRemapped from "enhancers/withPropRemapped";

export default (displayName, testId, readKey, writeKey, readToWriteMapper) =>
  flowRight(
    withProps({ displayName, testId, readKey }),
    withAnswerValidation(readKey),
    withUpdateAnswerValidation,
    withToggleAnswerValidation,
    withPropRemapped(
      "onUpdateAnswerValidation",
      "onUpdate",
      readToWriteMapper(writeKey)
    ),
    withEntityEditor(readKey),
    withPropRenamed(readKey, "validation")
  )(Validation);
