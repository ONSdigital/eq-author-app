import PropTypes from "prop-types";
import { mount } from "enzyme";
import createRouterContext from "react-router-test-context";

const mountWithRouter = child =>
  mount(child, {
    context: createRouterContext(),
    childContextTypes: { router: PropTypes.object }
  });

export default mountWithRouter;
