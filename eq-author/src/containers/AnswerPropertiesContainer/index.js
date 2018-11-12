import { flowRight } from "lodash";

import withUpdateAnswer from "containers/enhancers/withUpdateAnswer";
import AnswerProperties from "components/AnswerProperties";

export default flowRight(withUpdateAnswer)(AnswerProperties);
