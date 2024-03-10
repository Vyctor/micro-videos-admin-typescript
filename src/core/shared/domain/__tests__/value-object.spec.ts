import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(private readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(private readonly prop1: string, private readonly prop2: number) {
    super();
  }
}

describe("Value Object Unit Tests", () => {
  it("should be equals", () => {
    const valueObject1 = new StringValueObject("test");
    const valueObject2 = new StringValueObject("test");
    expect(valueObject1.equals(valueObject2)).toBe(true);

    const valueObject3 = new ComplexValueObject("test", 1);
    const valueObject4 = new ComplexValueObject("test", 1);
    expect(valueObject3.equals(valueObject4)).toBe(true);
  });

  it("should not be equals", () => {
    const valueObject1 = new StringValueObject("test");
    const valueObject2 = new StringValueObject("test2");
    expect(valueObject1.equals(valueObject2)).toBe(false);
  });
});
