import { useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Check, Clock, Package, Truck, X } from "lucide-react";

type TradeType = "shirt-for-shirt" | "shirt-plus-money" | "sell-for-money";
type TradeStatus = "pending" | "accepted" | "shipped" | "completed" | "rejected";

export function TradeFlowPage() {
  const { id } = useParams();
  const [selectedTradeType, setSelectedTradeType] = useState<TradeType | null>(null);
  const [selectedShirt, setSelectedShirt] = useState<string | null>(null);
  const [moneyOffer, setMoneyOffer] = useState("");
  const [tradeStatus, setTradeStatus] = useState<TradeStatus>("pending");

  // Mock data for the shirt being traded for
  const targetShirt = {
    team: "Real Madrid",
    league: "La Liga",
    size: "L",
    image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
    owner: "Alex R.",
  };

  // Mock user's shirts
  const myShirts = [
    {
      id: "1",
      team: "Barcelona",
      league: "La Liga",
      size: "L",
      image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
    },
    {
      id: "2",
      team: "Manchester United",
      league: "Premier League",
      size: "M",
      image: "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
    },
  ];

  const handleSubmitTrade = () => {
    alert("Trade offer submitted!");
    setTradeStatus("pending");
  };

  const statusSteps = [
    { status: "pending", label: "Pending", icon: Clock },
    { status: "accepted", label: "Accepted", icon: Check },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "completed", label: "Completed", icon: Package },
  ];

  const getCurrentStepIndex = () => {
    return statusSteps.findIndex((step) => step.status === tradeStatus);
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trade Request</h1>
          <p className="text-muted-foreground">
            Submit your offer for this shirt
          </p>
        </div>

        {/* Target Shirt Card */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">You're Trading For</h2>
          <div className="flex items-center gap-4">
            <img
              src={targetShirt.image}
              alt={targetShirt.team}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="text-2xl font-bold">{targetShirt.team}</h3>
              <p className="text-muted-foreground">{targetShirt.league}</p>
              <p className="text-sm text-muted-foreground">
                Size {targetShirt.size} • Listed by {targetShirt.owner}
              </p>
            </div>
          </div>
        </div>

        {/* Trade Type Selection */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Choose Trade Type</h2>
          <div className="grid gap-4">
            <button
              onClick={() => setSelectedTradeType("shirt-for-shirt")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "shirt-for-shirt"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Shirt-for-Shirt Trade</div>
              <div className="text-sm text-muted-foreground">
                Exchange one of your shirts for this one
              </div>
            </button>

            <button
              onClick={() => setSelectedTradeType("shirt-plus-money")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "shirt-plus-money"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Shirt + Money Offer</div>
              <div className="text-sm text-muted-foreground">
                Offer one of your shirts plus cash
              </div>
            </button>

            <button
              onClick={() => setSelectedTradeType("sell-for-money")}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTradeType === "sell-for-money"
                  ? "border-red-500 bg-red-500/10"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="font-bold mb-1">Buy for Money</div>
              <div className="text-sm text-muted-foreground">
                Purchase this shirt with cash only
              </div>
            </button>
          </div>
        </div>

        {/* Shirt Selection (for shirt trades) */}
        {(selectedTradeType === "shirt-for-shirt" ||
          selectedTradeType === "shirt-plus-money") && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Select Your Shirt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myShirts.map((shirt) => (
                <button
                  key={shirt.id}
                  onClick={() => setSelectedShirt(shirt.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedShirt === shirt.id
                      ? "border-red-500 bg-red-500/10"
                      : "border-border hover:border-red-500/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={shirt.image}
                      alt={shirt.team}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div>
                      <div className="font-bold">{shirt.team}</div>
                      <div className="text-sm text-muted-foreground">
                        {shirt.league} • Size {shirt.size}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Money Offer */}
        {(selectedTradeType === "shirt-plus-money" ||
          selectedTradeType === "sell-for-money") && (
          <div className="bg-card border border-border rounded-xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Your Money Offer</h2>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={moneyOffer}
                onChange={(e) => setMoneyOffer(e.target.value)}
                className="w-full pl-8 pr-4 py-3 bg-accent rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmitTrade}
          disabled={!selectedTradeType}
          className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold"
        >
          Submit Trade Offer
        </button>

        {/* Trade Status Tracker */}
        <div className="mt-12 bg-card border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-8">Trade Status</h2>
          
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-8 right-8 h-1 bg-muted">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-red-700 transition-all duration-500"
                style={{
                  width: `${(getCurrentStepIndex() / (statusSteps.length - 1)) * 100}%`,
                }}
              ></div>
            </div>

            {/* Status Steps */}
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

          {/* Status Actions */}
          {tradeStatus === "pending" && (
            <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">
                ⏳ Your trade offer is pending. The owner will review it soon.
              </p>
            </div>
          )}

          {tradeStatus === "rejected" && (
            <div className="mt-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
              <X className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-600 dark:text-red-400">
                This trade was rejected. Try making a different offer!
              </p>
            </div>
          )}

          {/* Test Buttons (for demo purposes) */}
          <div className="mt-8 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Demo Controls:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTradeStatus("pending")}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-600 rounded-lg text-sm"
              >
                Set Pending
              </button>
              <button
                onClick={() => setTradeStatus("accepted")}
                className="px-4 py-2 bg-green-500/20 text-green-600 rounded-lg text-sm"
              >
                Set Accepted
              </button>
              <button
                onClick={() => setTradeStatus("shipped")}
                className="px-4 py-2 bg-red-500/20 text-red-600 rounded-lg text-sm"
              >
                Set Shipped
              </button>
              <button
                onClick={() => setTradeStatus("completed")}
                className="px-4 py-2 bg-zinc-500/20 text-zinc-500 rounded-lg text-sm"
              >
                Set Completed
              </button>
              <button
                onClick={() => setTradeStatus("rejected")}
                className="px-4 py-2 bg-red-500/20 text-red-600 rounded-lg text-sm"
              >
                Set Rejected
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


