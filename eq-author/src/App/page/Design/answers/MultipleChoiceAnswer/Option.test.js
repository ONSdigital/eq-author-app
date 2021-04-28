import React from "react";

import WrappingInput from "components/Forms/WrappingInput";
import { shallow, mount } from "enzyme";
import { StatelessOption } from "./Option";
import DeleteButton from "components/buttons/DeleteButton";
import { CHECKBOX, RADIO } from "constants/answer-types";

import { merge } from "lodash";
import createMockStore from "tests/utils/createMockStore";
import { useMutation } from "@apollo/react-hooks";
import { props } from "lodash/fp";

import { render as rtlRender, fireEvent, flushPromises, screen } from "tests/utils/rtl";


jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

// jest.mock("@apollo/react-hooks", () => ({
//   useMutation: () => [
//     jest.fn(
//       () =>
//         new Promise((resolve) =>
//           resolve({
//             data: {
//               createFolder: { id: "new-folder", pages: [{ id: "page-1" }] },
//             },
//           })
//         )
//     ),
//   ],
// }));

describe("Option", () => {
  let mockMutations;
  let mockEvent;
  let wrapper;
  let store;

  const option = {
    id: "1",
    label: "",
    description: "",
    additionalAnswer: {
      id: "additional1",
      label: "",
      type: "TextField",
    },
    __typename: "Option",
  };

  // const createWrapper = (otherProps, render = shallow) => {
  //   return render(<StatelessOption
  //           {...mockMutations}
  //           option={option}
  //           hasDeleteButton
  //           type={RADIO}
  //           store={store}
  //           {...otherProps}
  //         />);
  // };

  const render = (method = shallow, otherProps) => {
    wrapper = method(
      <StatelessOption
        {...mockMutations}
        option={option}
        hasDeleteButton
        type={RADIO}
        store={store}
        {...otherProps}
      />
    );

    return wrapper;
  };

  beforeEach(() => {

    // props = {
    //   onBlur: jest.fn(),
    //   onChange: jest.fn(),
    //   onUpdate: jest.fn(),
    //   onFocus: jest.fn(),
    //   onDelete: jest.fn(),
    //   onEnterKey: jest.fn(),
    // };

    mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    store = createMockStore();

    mockMutations = {
      onBlur: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onFocus: jest.fn(),
      onDelete: jest.fn(),
      onEnterKey: jest.fn(),
    };

    render();
  });

  it("should match snapshot", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a checkbox", () => {
    render(mount, { type: CHECKBOX });
    expect(wrapper).toMatchSnapshot();
  });

  it("shouldn't render delete button if not applicable", () => {
    wrapper.setProps({ hasDeleteButton: false });
    expect(wrapper).toMatchSnapshot();
  });



  // it.only("should call onChange and onBlur correctly", async () => {
  //   const { getByTestId } = render(( otherProps) => <StatelessOption {...mockMutations}
  //     option={option}
  //     hasDeleteButton
  //     type={RADIO}
  //     store={store}
  //     {...otherProps}
  //    {...props} />);

  //   fireEvent.change(getByTestId("option-label"), {
  //     target: { value: "2" },
  //   });
  //   fireEvent.blur(getByTestId("number-input"));
  //   await flushPromises();
  //   expect(props.onBlur).toHaveBeenCalledWith(2);
  // });




  it.only("should call onChange on input", async() => {
    render(rtlRender, { type: CHECKBOX });
    // screen.debug();

    fireEvent.change(screen.getByTestId("option-label"), {
          target: { value: "2" },
        });
        // fireEvent.blur(screen.getByTestId("option-label"));
        // await flushPromises();
        expect(mockMutations.onChange).toHaveBeenCalledTimes(2);

    // const input = wrapper
    //   .find(`[data-test="option-label"]`)
    //   .first()
    //   .simulate("change");

    // wrapper
    // .find("[data-test='option-label']")
    // .first().simulate("change");
    // wrapper.find("[data-test='option-description']").first().simulate("change");

    // expect(mockMutations.onChange).toHaveBeenCalledTimes(1);
  });

  it("should update label on blur", () => {
    wrapper.find("[data-test='option-label']").simulate("blur", mockEvent);

    expect(mockMutations.onUpdate).toHaveBeenCalled();
  });

  it("should update description on blur", () => {
    wrapper
      .find("[data-test='option-description']")
      .simulate("blur", mockEvent);

    expect(mockMutations.onUpdate).toHaveBeenCalled();
  });

  it("should invoke onDelete callback when option deleted", () => {
    wrapper.find(DeleteButton).simulate("click", mockEvent);

    expect(mockMutations.onDelete).toHaveBeenCalledWith(option.id);
  });

  it("should call onEnterKey when Enter key pressed", () => {
    console.log(wrapper.debug({verbose:true}));

    wrapper
      .find(WrappingInput)
      .first()
      .simulate("keyDown", merge(mockEvent, { keyCode: 13 }));

    expect(mockMutations.onEnterKey).toHaveBeenCalledWith(mockEvent);
  });

  it("should not call onEnterKey when other keys are pressed", () => {
    wrapper
      .find(WrappingInput)
      .first()
      .simulate("keyDown", merge(mockEvent, { keyCode: 27 }));

    expect(mockMutations.onEnterKey).not.toHaveBeenCalled();
  });

  it("can turn off auto-focus", () => {
    wrapper = render(mount, { autoFocus: false });
    const input = wrapper
      .find(`[data-test="option-label"]`)
      .first()
      .getDOMNode();

    expect(input.hasAttribute("data-autofocus")).toBe(false);
  });
});
