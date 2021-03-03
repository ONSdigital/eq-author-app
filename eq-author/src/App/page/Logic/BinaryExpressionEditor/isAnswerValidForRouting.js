import { get } from "lodash";
import { RADIO, CURRENCY, NUMBER } from "constants/answer-types";

const isAnswerValidForRouting = (answer) => {
  const type = get(answer, "type");
  return [RADIO, CURRENCY, NUMBER].includes(type);
};

export default isAnswerValidForRouting;
