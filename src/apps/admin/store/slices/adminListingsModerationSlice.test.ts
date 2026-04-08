import { describe, expect, it } from "vitest";
import reducer, { loadAdminListings, moderateListing } from "./adminListingsModerationSlice";

describe("adminListingsModerationSlice", () => {
  it("does not mutate listing status before moderation succeeds", () => {
    const loaded = reducer(
      undefined,
      loadAdminListings.fulfilled(
        {
          items: [
            {
              id: "listing-1",
              ownerUid: "u1",
              ownerName: "Owner",
              size: "L",
              status: "pending_approval",
              shirtSnapshot: {},
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

    const pending = reducer(
      loaded,
      moderateListing.pending("req-2", {
        listingId: "listing-1",
        action: "approve",
      }),
    );

    expect(pending.entities["listing-1"]?.status).toBe("pending_approval");
  });

  it("removes moderated listing from pending queue on success", () => {
    const loaded = reducer(
      undefined,
      loadAdminListings.fulfilled(
        {
          items: [
            {
              id: "listing-1",
              ownerUid: "u1",
              ownerName: "Owner",
              size: "L",
              status: "pending_approval",
              shirtSnapshot: {},
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

    const fulfilled = reducer(
      loaded,
      moderateListing.fulfilled(
        { listingId: "listing-1", action: "approve" },
        "req-2",
        { listingId: "listing-1", action: "approve" },
      ),
    );

    expect(fulfilled.ids).toEqual([]);
    expect(fulfilled.entities["listing-1"]).toBeUndefined();
  });
});
