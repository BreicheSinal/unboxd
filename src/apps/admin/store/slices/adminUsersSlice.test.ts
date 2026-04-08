import { describe, expect, it } from "vitest";
import reducer, { changeAdminUserAccess, loadAdminUsers } from "./adminUsersSlice";

describe("adminUsersSlice", () => {
  it("loads users map", () => {
    const state = reducer(
      undefined,
      loadAdminUsers.fulfilled(
        {
          items: [
            {
              uid: "u1",
              email: "a@b.com",
              displayName: "A",
              role: "user",
              disabled: false,
              createdAt: null,
              updatedAt: null,
            },
          ],
          nextCursor: "u1",
        },
        "req-1",
        undefined,
      ),
    );

    expect(state.ids).toEqual(["u1"]);
    expect(state.entities.u1?.email).toBe("a@b.com");
  });

  it("applies access changes", () => {
    const loaded = reducer(
      undefined,
      loadAdminUsers.fulfilled(
        {
          items: [
            {
              uid: "u1",
              email: "a@b.com",
              displayName: "A",
              role: "user",
              disabled: false,
              createdAt: null,
              updatedAt: null,
            },
          ],
          nextCursor: null,
        },
        "req-1",
        undefined,
      ),
    );

    const updated = reducer(
      loaded,
      changeAdminUserAccess.fulfilled({ uid: "u1", disabled: true }, "req-2", {
        uid: "u1",
        disabled: true,
      }),
    );

    expect(updated.entities.u1?.disabled).toBe(true);
  });
});
