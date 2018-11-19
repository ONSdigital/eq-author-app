import { CHECKBOX, RADIO } from "constants/answer-types";

const isMultipleChoice = type => [CHECKBOX, RADIO].includes(type);

export default isMultipleChoice;
