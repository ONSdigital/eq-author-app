import appendAuthHeader from "./authHeader";
import appendVersionHeader from "./versionHeader";
import pipeP from "utils/pipeP";

export default pipeP(appendAuthHeader, appendVersionHeader);
