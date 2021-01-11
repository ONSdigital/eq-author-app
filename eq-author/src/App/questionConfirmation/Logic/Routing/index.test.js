import React from "react";
import { shallow } from "enzyme";
import Routing from ".";

jest.mock("@apollo/react-hooks", () => ({
  useQuery: jest.fn(() => ({ loading: true, error: null, data: null })),
}));

describe("questionConfirmation/Routing", () => {
  it("should render", () => {
    const wrapper = shallow(
      <Routing
        match={{
          params: {
            confirmationId: "my-fave-confirmation-1",
          },
        }}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
