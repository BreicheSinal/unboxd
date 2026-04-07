import { describe, expect, it } from "vitest";
import { mapFirebaseError } from "./errorService";

describe("mapFirebaseError", () => {
  it("maps known auth errors", () => {
    expect(mapFirebaseError({ code: "auth/user-not-found" })).toBe("Invalid email or password.");
  });

  it("maps permission errors", () => {
    expect(mapFirebaseError({ code: "permission-denied" })).toBe(
      "You do not have permission to perform this action.",
    );
  });

  it("falls back to message for unknown errors", () => {
    expect(mapFirebaseError({ code: "unknown", message: "x" })).toBe("x");
  });
});
