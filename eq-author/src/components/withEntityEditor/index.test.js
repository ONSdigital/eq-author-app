import React from "react";
import withEntityEditor from "./";
import { shallow } from "enzyme";
import gql from "graphql-tag";
import { SynchronousPromise } from "synchronous-promise";
import { omit } from "lodash";
import createMockStore from "tests/utils/createMockStore";

const Component = props => <div {...props} />;

const fragment = gql`
  fragment Entity on Entity {
    id
    title
    alias
  }
`;

describe("withEntityEditor", () => {
  let wrapper,
    entity,
    handleUpdate,
    handleSubmit,
    handleStartRequest,
    handleEndRequest;
  const ComponentWithEntity = withEntityEditor("entity", fragment)(Component);
  let store;

  const render = (props = {}) =>
    shallow(
      <ComponentWithEntity
        entity={entity}
        onUpdate={handleUpdate}
        onSubmit={handleSubmit}
        store={store}
        {...props}
      />
    ).dive();

  beforeEach(() => {
    handleUpdate = jest.fn(() => SynchronousPromise.resolve());
    handleSubmit = jest.fn(() => Promise.resolve());
    handleStartRequest = jest.fn();
    handleEndRequest = jest.fn();
    store = createMockStore();
    entity = {
      id: "1",
      title: "foo",
      alias: "alias",
      __typename: "Foo"
    };

    wrapper = render();
  });

  it("should set state with prop values", () => {
    const newProps = {
      entity: {
        id: 1,
        title: "new title",
        __typename: "Foo"
      }
    };
    wrapper.setProps(newProps);
    expect(wrapper.state("entity")).toEqual(newProps.entity);
  });

  it("should not update state if the entity does not change", () => {
    const newValue = "foo1";
    wrapper.simulate("change", { name: "title", value: newValue });
    wrapper.setProps({ entity });
    wrapper.simulate("update");
    expect(handleUpdate).toHaveBeenCalledWith({
      ...omit(entity, "__typename"),
      title: "foo1"
    });
  });

  it("should update the state if the entity does change", () => {
    wrapper.setProps({ entity: { ...entity, title: "hello" } });
    expect(wrapper.dive().prop("entity")).toMatchObject({
      title: "hello"
    });
  });

  it("should correctly un-mount component", () => {
    const instance = wrapper.instance();
    expect(instance.unmounted).toBeFalsy();
    wrapper.unmount();
    expect(instance.unmounted).toBeTruthy();
  });

  it("should have an appropriate displayName", () => {
    expect(ComponentWithEntity.displayName).toBe(
      "Connect(withEntityEditor(Component))"
    );
  });

  it("should put entity into state", () => {
    expect(wrapper.state("entity")).toEqual(entity);
  });

  it("should pass entity to wrapped component", () => {
    expect(wrapper.dive().prop("entity")).toEqual(entity);
  });

  it("should not call onUpdate when new values are the same", () => {
    const newValue = "foo";
    wrapper.simulate("change", { name: "title", value: newValue });
    wrapper.update();
    expect(handleUpdate).not.toHaveBeenCalled();
  });

  it("should pass filtered entity to callback onUpdate", () => {
    const newValue = "foo1";

    wrapper.simulate("change", { name: "title", value: newValue });
    wrapper.simulate("update");

    expect(handleUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: newValue })
    );
  });

  it("should pass filtered entity to callback onSubmit", () => {
    const preventDefault = jest.fn();

    wrapper.simulate("submit", { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(handleSubmit).toHaveBeenCalledWith(omit(entity, "__typename"));
  });

  it("should update state when new entity passed via props", () => {
    const newEntity = { id: "2", title: "blah" };

    wrapper.setProps({ entity: newEntity });

    expect(wrapper.state("entity")).toEqual(newEntity);
  });

  it("should update state when new entity with same id of different type passed via props", () => {
    const newEntity = {
      id: "1",
      title: "bar",
      __typename: "Bar"
    };

    wrapper.setProps({ entity: newEntity });

    expect(wrapper.state("entity")).toEqual(newEntity);
  });

  it("should update state when properties of entity have changed", () => {
    const newEntity = {
      id: "1",
      title: "foo",
      properties: {
        value: "updated"
      },
      __typename: "Foo"
    };

    wrapper.setProps({ entity: newEntity });

    expect(wrapper.state("entity")).toEqual(newEntity);
  });

  it("should only update when state is dirty", () => {
    const newValue = "foo1";

    wrapper.simulate("update");

    expect(handleUpdate).not.toHaveBeenCalled();

    wrapper.simulate("change", { name: "title", value: newValue });
    wrapper.simulate("update");

    expect(handleUpdate).toHaveBeenCalled();
  });

  it("should call startRequest on Update and stopRequest Completion", () => {
    const newValue = "foo1";

    wrapper.setProps({
      startRequest: handleStartRequest,
      endRequest: handleEndRequest
    });
    wrapper.simulate("change", { name: "title", value: newValue });
    wrapper.simulate("update");

    expect(handleStartRequest).toHaveBeenCalled();
    expect(handleEndRequest).toHaveBeenCalled();
  });

  it("should call startRequest and stopRequest on failure", () => {
    const newValue = "foo1";
    handleUpdate = jest.fn(() =>
      SynchronousPromise.reject(new Error("message"))
    );
    const failingWrapper = render();
    failingWrapper.setProps({
      startRequest: handleStartRequest,
      endRequest: handleEndRequest
    });

    failingWrapper.simulate("change", { name: "title", value: newValue });
    failingWrapper.simulate("update");

    expect(handleStartRequest).toHaveBeenCalled();
    expect(handleEndRequest).toHaveBeenCalled();
  });

  it("should pass on any other props to wrapped component", () => {
    const newProps = { lol: "cats" };

    wrapper.setProps(newProps);

    expect(wrapper.props()).toMatchObject(newProps);
  });

  it("should use the name to create deeply nested entities", () => {
    const fragment = gql`
      fragment Example on Example {
        id
        title
        deep {
          thing
        }
      }
    `;
    const ComponentWithEntity = withEntityEditor("entity", fragment)(Component);
    const entity = {
      id: 1,
      title: "title",
      deep: {
        thing: "original"
      },
      __typename: "Foo"
    };
    const wrapper = shallow(
      <ComponentWithEntity
        entity={entity}
        onUpdate={handleUpdate}
        store={store}
      />
    ).dive();

    wrapper.simulate("change", { name: "deep.thing", value: "updated" });
    wrapper.simulate("update");
    expect(handleUpdate).toHaveBeenCalledWith({
      id: 1,
      title: "title",
      deep: {
        thing: "updated"
      }
    });
  });

  it("should not overwrite fields that are being changed", () => {
    // Changing something whilst other field network request is running
    wrapper.simulate("change", { name: "alias", value: "updated" });
    // first network request comes back
    wrapper.setProps({
      entity: {
        id: 1,
        title: "New title",
        alias: "alias",
        __typename: "Example"
      }
    });
    expect(wrapper.dive().prop("entity")).toMatchObject({
      title: "New title",
      alias: "updated"
    });

    wrapper.simulate("update");
    expect(handleUpdate).toHaveBeenCalledWith({
      id: 1,
      title: "New title",
      alias: "updated"
    });
  });

  it("should not call update if there is no change after a submit", () => {
    wrapper.simulate("change", { name: "alias", value: "updated" });
    wrapper.setProps({
      entity: {
        id: 1,
        title: "New title",
        alias: "alias",
        __typename: "Example"
      }
    });

    wrapper.simulate("submit", { preventDefault: jest.fn() });

    wrapper.simulate("update");
    expect(handleUpdate).not.toHaveBeenCalled();
  });

  it("should not blow up if the change is called after the component is unmounted", () => {
    const instance = wrapper.instance();
    wrapper.unmount();
    expect(() => {
      instance.handleChange({ name: "title", value: "New title" });
    }).not.toThrow();
  });
});
