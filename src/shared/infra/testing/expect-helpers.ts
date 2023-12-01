import { FieldsErrors } from "../../domain/validators/validator-fields-interface";
import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertionContainsErrorMessages(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }

      return assertionContainsErrorMessages(validator.errors, received);
    }
  },
});

function assertionContainsErrorMessages(
  expected: FieldsErrors,
  received: FieldsErrors
): any {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? { pass: true, message: () => {} }
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current ${JSON.stringify(expected)}`,
      };
}

function isValid() {
  return {
    message: () => "expected to be valid",
    pass: true,
  };
}
