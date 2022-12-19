import { get } from "lodash";
import { RADIO, CURRENCY, NUMBER, DATE } from "constants/answer-types";

const isAnswerValidForRouting = (answer) => {
  const type = get(answer, "type");
  return [RADIO, CURRENCY, NUMBER, DATE].includes(type);
};

export default isAnswerValidForRouting;
