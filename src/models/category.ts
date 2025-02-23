import { ValidationError } from "../errors/errors";

export interface Category {
  name: String;
  description?: String | null;
}

export const validateCategory = (obj: object): Category => {
  if ("name" in obj) {
    if (typeof obj.name !== "string") {
      throw new ValidationError("Validation Error", {
        violations: ["field `name` should be string"],
      });
    }
    let name = obj.name as String;
    let description = null;
    if ("description" in obj) {
      if (typeof obj.description !== "string") {
        throw new ValidationError("Validation Error", {
          violations: ["field `description` should be string"],
        });
      }
      description = obj.description;
    }
    return { name, description };
  } else {
    throw new ValidationError("Validation Error", {
      violations: ["field `name` is required"],
    });
  }
};
