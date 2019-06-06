import "jest-styled-components";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import "@testing-library/react/cleanup-after-each";
import { configure } from "@testing-library/dom";

configure({ testIdAttribute: "data-test" });

Enzyme.configure({ adapter: new Adapter() });

export {};
