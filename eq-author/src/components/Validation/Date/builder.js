import { flowRight } from "lodash/fp";

import withToggleAnswerValidation from "containers/enhancers/withToggleAnswerValidation";
import withUpdateAnswerValidation from "containers/enhancers/withUpdateAnswerValidation";
import withEntityEditor from "components/withEntityEditor";

import withAnswerValidation from "../withAnswerValidation";

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
