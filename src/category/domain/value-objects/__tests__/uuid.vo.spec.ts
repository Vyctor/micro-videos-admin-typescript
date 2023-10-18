import { Uuid } from "../uuid.vo";
import { validate } from "uuid";

describe("UUID Unit Tests", () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, "validate");
  it("should throw an error if the id is not a valid UUID", () => {
    expect(() => {
      new Uuid("invalid_uuid");
    }).toThrowError("ID must be a valid UUID");
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should create a valid UUID", () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(validate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  it("should accept a valid UUID", () => {
    const uuid = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
    const uuidObject = new Uuid(uuid);
    expect(uuidObject.id).toBe(uuid);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
