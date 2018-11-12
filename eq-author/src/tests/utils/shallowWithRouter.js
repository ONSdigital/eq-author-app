import PropTypes from "prop-types";
import { shallow } from "enzyme";
import createRouterContext from "react-router-test-context";

const shallowWithRouter = child =>
  shallow(child, {
    context: createRouterContext(),
    childContextTypes: { router: PropTypes.object }
  });

export default shallowWithRouter;
