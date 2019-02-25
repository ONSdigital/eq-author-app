import appendAuthHeader from "./authHeader";
import appendVersionHeader from "./versionHeader";
import { flow } from "lodash";

export default flow(
  appendAuthHeader,
  appendVersionHeader
);
