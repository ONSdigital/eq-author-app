import "jest-styled-components";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import "react-testing-library/cleanup-after-each";
import { configure } from "dom-testing-library";

configure({ testIdAttribute: "data-test" });

Enzyme.configure({ adapter: new Adapter() });

export {};
