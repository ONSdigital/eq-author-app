import pipeP from "./pipeP";

const addUnicorn = str => Promise.resolve(`${str} Unicorn`);
const addRainbow = str => Promise.resolve(`${str} Rainbow`);
const addNonPromise = str => `${str} Foo`;

describe("pipeP", () => {
  it("throws if no arguments supplied", () => {
    expect(() => pipeP()).toThrow();
  });

  it("works with a single function", () => {
    const single = pipeP(addUnicorn);
    return expect(single("❤️")).resolves.toBe("❤️ Unicorn");
  });

  it("works with with multiple functions", () => {
    const multi = pipeP(addUnicorn, addRainbow);
    expect(multi("❤️")).resolves.toBe("❤️ Unicorn Rainbow");
  });

  it("works with a mix of promise and non-promise functions", () => {
    const mixed = pipeP(addNonPromise, addUnicorn, addRainbow);
    return expect(mixed("❤️")).resolves.toBe("❤️ Foo Unicorn Rainbow");
  });
});
