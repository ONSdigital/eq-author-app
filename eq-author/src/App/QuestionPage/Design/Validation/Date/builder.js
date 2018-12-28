import { flowRight } from "lodash/fp";

import withToggleAnswerValidation from "App/QuestionPage/Design/Validation/withToggleAnswerValidation";
import withUpdateAnswerValidation from "App/QuestionPage/Design/Validation/withUpdateAnswerValidation";
import withEntityEditor from "App/components/withEntityEditor";

import withAnswerValidation from "App/QuestionPage/Design/Validation/withAnswerValidation";

import { withProps, withPropRenamed, withPropRemapped } from "utils/enhancers";

export default (
  displayName,
  testId,
  readKey,
  writeKey,
  fragment,
  readToWriteMapper,
  propKey
) =>
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
    withEntityEditor(readKey, fragment),
    withPropRenamed(readKey, propKey)
  );
