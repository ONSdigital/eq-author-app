import "jest-styled-components";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/dom";
import "core-js/stable";

configure({ testIdAttribute: "data-test" });

Enzyme.configure({ adapter: new Adapter() });

export {};
