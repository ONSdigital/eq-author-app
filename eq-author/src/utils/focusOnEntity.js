import { invoke } from "lodash";
import getIdForObject from "utils/getIdForObject";

const focusOnEntity = entity => {
  const id = getIdForObject(entity);
  const node = document.querySelector(`#${id} [data-autofocus]`);
  invoke(node, "focus");
};

export default focusOnEntity;
