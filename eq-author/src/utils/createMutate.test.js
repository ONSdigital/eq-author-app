import createMutate from "utils/createMutate";

describe("createMutate", () => {
  let client;
  let mutation;
  let options;

  beforeEach(() => {
    client = {
      mutate: jest.fn(),
    };

    mutation = jest.fn();

    options = {
      some: "option",
    };
  });

  it("should return a function", () => {
    expect(createMutate(client, mutation)).toEqual(expect.any(Function));
  });

  it("should call client mutate, passing in the mutation and any options", () => {
    createMutate(client, mutation)(options);
    expect(client.mutate).toHaveBeenCalledWith(
      expect.objectContaining({
        mutation,
        ...options,
      })
    );
  });
});
