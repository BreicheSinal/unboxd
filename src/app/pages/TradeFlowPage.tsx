import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Clock, Package, Truck, CircleX } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import type { ClosetItem, MarketplaceListing, TradeStatus, TradeType } from "../types/domain";
import { getListingById } from "../services/marketplaceService";
import { createTradeOffer } from "../services/tradeService";
import { subscribeCloset } from "../services/closetService";
import { mapFirebaseError } from "../services/errorService";

export function TradeFlowPage() {
  const { id } = useParams();
  const user = useAppSelector((state) => state.auth.user);
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType | null>(null);
  const [selectedShirt, setSelectedShirt] = useState<string | null>(null);
  const [moneyOffer, setMoneyOffer] = useState("");
  const [tradeStatus, setTradeStatus] = useState<TradeStatus>("pending");
  const [listing, setListing] = useState<MarketplaceListing | null>(null);
  const [myShirts, setMyShirts] = useState<ClosetItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isListingLoading, setIsListingLoading] = useState(true);
  const [listingError, setListingError] = useState<string | null>(null);
  const [closetError, setClosetError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    setIsListingLoading(true);
    setListingError(null);

    getListingById(id)
      .then((result) => {
        if (!isMounted) return;
        if (!result) {
          setListingError("This listing was not found.");
          setIsListingLoading(false);
          return;
        }
        setListing(result);
        setIsListingLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setListingError("Failed to load listing details from Firestore.");
        setIsListingLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!user) {
      setMyShirts([]);
      return;
    }

    setClosetError(null);
    const unsubscribe = subscribeCloset(
      user.uid,
      (items) => {
        const tradable = items.filter((item) => item.status === "owned");
        setMyShirts(tradable);
      },
      "owned",
      () => {
        setClosetError("Failed to load your tradable shirts from Firestore.");
        setMyShirts([]);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const handleSubmitTrade = async () => {
    if (!selectedTradeType || !user || !listing) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      await createTradeOffer({
        listingId: id ?? listing.id,
        fromUid: user.uid,
        toUid: listing.ownerUid,
        tradeType: selectedTradeType,
        offeredShirtId: selectedShirt ?? undefined,
        cashAmount: moneyOffer ? Number(moneyOffer) : undefined,
      });
      setTradeStatus("pending");
      setSubmitSuccess("Trade offer submitted successfully.");
    } catch (error) {
      setSubmitError(mapFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusSteps: Array<{ status: TradeStatus; label: string; icon: typeof Clock }> = [
    { status: "pending", label: "Pending", icon: Clock },
    { status: "accepted", label: "Accepted", icon: Check },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "completed", label: "Completed", icon: Package },
  ];

  const getCurrentStepIndex = () => statusSteps.findIndex((step) => step.status === tradeStatus);

  if (isListingLoading) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">Loading listing...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            to="/marketplace"
            className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {listingError ?? "Listing not found."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          to="/marketplace"
          className="inline-flex min-h-11 items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Trade Request</h1>
          <p className="text-muted-foreground">Submit your offer for this shirt</p>
        </div>

        {closetError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {closetError}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-5 md:p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">You're Trading For</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <img
              src={listing.shirtSnapshot.imageUrl}
              alt={listing.shirtSnapshot.team}
              className="w-full sm:w-24 h-44 sm:h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-2xl font-bold">{listing.shirtSnapshot.team}</h3>
              <p className="text-muted-foreground">{listing.shirtSnapshot.league}</p>
              <p className="text-sm text-muted-foreground">
                Size {listing.shirtSnapshot.size} | Listed by {listing.ownerName ?? "Collector"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 md:p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Choose Trade Type</h2>
          <div className="grid gap-4">
            <button
              onClick={() => setSelectedTradeType("shirt-for-shirt")}
              className={`min-h-11 p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "shirt-for-shirt"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Shirt-for-Shirt Trade</div>
              <div className="text-sm text-muted-foreground">Exchange one of your shirts for this one</div>
            </button>

            <button
              onClick={() => setSelectedTradeType("shirt-plus-money")}
              className={`min-h-11 p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "shirt-plus-money"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Shirt + Money Offer</div>
              <div className="text-sm text-muted-foreground">Offer one of your shirts plus cash</div>
            </button>

            <button
              onClick={() => setSelectedTradeType("sell-for-money")}
              className={`min-h-11 p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "sell-for-money"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Buy for Money</div>
              <div className="text-sm text-muted-foreground">Purchase this shirt with cash only</div>
            </button>
          </div>
        </div>

        {(selectedTradeType === "shirt-for-shirt" || selectedTradeType === "shirt-plus-money") && (
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Select Your Shirt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myShirts.map((shirt) => (
                <button
                  key={shirt.id}
                  onClick={() => setSelectedShirt(shirt.id)}
                  className={`min-h-11 p-4 rounded-lg border-2 transition-all text-left ${
                    selectedShirt === shirt.id
                      ? "border-red-500 bg-red-500/10"
                      : "border-border hover:border-red-500/50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <img src={shirt.imageUrl} alt={shirt.team} className="w-full sm:w-16 h-32 sm:h-16 object-cover rounded-lg" />
                    <div>
                      <div className="font-bold">{shirt.team}</div>
                      <div className="text-sm text-muted-foreground">
                        {shirt.league} | Size {shirt.size}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {myShirts.length === 0 && (
              <div className="mt-4 rounded-lg border border-dashed border-border bg-accent/20 p-5 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">No tradable shirts available</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add shirts to your closet first, then return to make an offer.
                </p>
              </div>
            )}
          </div>
        )}

        {(selectedTradeType === "shirt-plus-money" || selectedTradeType === "sell-for-money") && (
          <div className="bg-card border border-border rounded-xl p-5 md:p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Your Money Offer</h2>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <input
                type="number"
                placeholder="0.00"
                value={moneyOffer}
                onChange={(e) => setMoneyOffer(e.target.value)}
                className="h-11 w-full pl-8 pr-4 bg-accent rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitTrade}
          disabled={!selectedTradeType || isSubmitting}
          className="w-full min-h-11 py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
        >
          {isSubmitting ? "Submitting..." : "Submit Trade Offer"}
        </button>
        {submitError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {submitError}
          </div>
        )}
        {submitSuccess && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {submitSuccess}
          </div>
        )}

        <div className="mt-12 bg-card border border-border rounded-xl p-5 md:p-8">
          <h2 className="text-2xl font-bold mb-8">Trade Status</h2>

          <div className="hidden md:block relative">
            <div className="absolute top-8 left-8 right-8 h-1 bg-muted">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-700 transition-all duration-500"
                style={{ width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="relative flex justify-between">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = getCurrentStepIndex() >= index;
                const isCurrent = getCurrentStepIndex() === index;

                return (
                  <div key={step.status} className="flex flex-col items-center">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 transition-all ${
                        isCompleted
                          ? "bg-gradient-to-br from-rose-500 to-red-700 text-white"
                          : "bg-muted text-muted-foreground"
                      } ${isCurrent ? "scale-110 shadow-lg" : ""}`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div
                      className={`text-sm text-center ${
                        isCompleted ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden space-y-3">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = getCurrentStepIndex() >= index;
              const isCurrent = getCurrentStepIndex() === index;

              return (
                <div key={step.status} className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isCompleted ? "bg-gradient-to-br from-rose-500 to-red-700 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm ${isCurrent ? "font-bold" : "text-muted-foreground"}`}>{step.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {tradeStatus === "pending" && (
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                Your trade offer is pending. The owner will review it soon.
              </p>
            </div>
          )}

          {tradeStatus === "rejected" && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <CircleX className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">
                This trade was rejected. Try making a different offer.
              </p>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Demo Controls:</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setTradeStatus("pending")} className="px-4 min-h-11 py-2 bg-yellow-500/20 text-yellow-600 rounded-lg text-sm">
                Set Pending
              </button>
              <button onClick={() => setTradeStatus("accepted")} className="px-4 min-h-11 py-2 bg-green-500/20 text-green-600 rounded-lg text-sm">
                Set Accepted
              </button>
              <button onClick={() => setTradeStatus("shipped")} className="px-4 min-h-11 py-2 bg-red-500/20 text-red-600 rounded-lg text-sm">
                Set Shipped
              </button>
              <button onClick={() => setTradeStatus("completed")} className="px-4 min-h-11 py-2 bg-zinc-500/20 text-zinc-500 rounded-lg text-sm">
                Set Completed
              </button>
              <button onClick={() => setTradeStatus("rejected")} className="px-4 min-h-11 py-2 bg-red-500/20 text-red-600 rounded-lg text-sm">
                Set Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
