import { flowRight } from "lodash/fp";

import withToggleValidationRule from "./withToggleValidationRule";
import withUpdateValidationRule from "./withUpdateValidationRule";
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
    withUpdateValidationRule,
    withToggleValidationRule,
    withPropRemapped("onUpdateValidationRule", "onUpdate", (entity) => [
      readToWriteMapper(writeKey)(entity),
      entity,
    ]),
    withEntityEditor(readKey),
    withPropRenamed(readKey, "validation")
  )(Validation);
