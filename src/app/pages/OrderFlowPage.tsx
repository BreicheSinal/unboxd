import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, ChevronLeft, Check, Package2, Palette, ShieldOff } from "lucide-react";

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

interface Exclusions {
  clubs: string[];
  leagues: string[];
  colors: string[];
}

export function OrderFlowPage() {
  const [step, setStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [exclusions, setExclusions] = useState<Exclusions>({
    clubs: [],
    leagues: [],
    colors: [],
  });

  const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
  
  const popularClubs = [
    "Real Madrid", "Barcelona", "Manchester United", "Liverpool",
    "Bayern Munich", "PSG", "Juventus", "AC Milan"
  ];
  
  const leagues = [
    "Premier League", "La Liga", "Serie A", "Bundesliga",
    "Ligue 1", "MLS", "Liga MX"
  ];
  
  const shirtColors = [
    { name: "Red", value: "#EF4444" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Green", value: "#10B981" },
    { name: "Yellow", value: "#F59E0B" },
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Orange", value: "#F97316" },
    { name: "Purple", value: "#A855F7" },
  ];

  const toggleClub = (club: string) => {
    setExclusions(prev => ({
      ...prev,
      clubs: prev.clubs.includes(club)
        ? prev.clubs.filter(c => c !== club)
        : [...prev.clubs, club]
    }));
  };

  const toggleLeague = (league: string) => {
    setExclusions(prev => ({
      ...prev,
      leagues: prev.leagues.includes(league)
        ? prev.leagues.filter(l => l !== league)
        : [...prev.leagues, league]
    }));
  };

  const toggleColor = (color: string) => {
    setExclusions(prev => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter(c => c !== color)
        : [...prev.colors, color]
    }));
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout! This would integrate with a payment provider.");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s === step
                      ? "bg-gradient-to-br from-rose-500 to-red-700 text-white"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`h-1 w-20 md:w-40 mx-2 transition-all ${
                      s < step ? "bg-green-500" : "bg-muted"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Select Size</span>
            <span>Exclusions</span>
            <span>Checkout</span>
          </div>
        </div>

        {/* Step 1: Size Selection */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-2">Select Your Size</h2>
              <p className="text-muted-foreground mb-8">
                Choose the size that fits you best
              </p>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      selectedSize === size
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/50"
                    }`}
                  >
                    <span className="font-bold text-xl">{size}</span>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setStep(2)}
                disabled={!selectedSize}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                Continue to Exclusions
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Exclusions */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-2">Set Your Exclusions</h2>
              <p className="text-muted-foreground mb-8">
                Optional: Avoid specific teams, leagues, or colors
              </p>
              
              {/* Avoid Clubs */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldOff className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Clubs</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {popularClubs.map((club) => (
                    <button
                      key={club}
                      onClick={() => toggleClub(club)}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        exclusions.clubs.includes(club)
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-border hover:border-red-500/50"
                      }`}
                    >
                      {club}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avoid Leagues */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Package2 className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Leagues</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {leagues.map((league) => (
                    <button
                      key={league}
                      onClick={() => toggleLeague(league)}
                      className={`p-3 rounded-lg border transition-all text-sm ${
                        exclusions.leagues.includes(league)
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-border hover:border-red-500/50"
                      }`}
                    >
                      {league}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avoid Colors */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Palette className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Colors</h3>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {shirtColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => toggleColor(color.name)}
                      className={`relative aspect-square rounded-lg border-2 transition-all ${
                        exclusions.colors.includes(color.name)
                          ? "border-red-500 opacity-50"
                          : "border-border hover:scale-110"
                      }`}
                      style={{ backgroundColor: color.value }}
                    >
                      {exclusions.colors.includes(color.name) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <X className="h-6 w-6 text-red-500 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  Continue to Review
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Checkout */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-card border border-border rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-2">Review Your Order</h2>
              <p className="text-muted-foreground mb-8">
                Confirm your mystery shirt order
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Mystery Box Visual */}
                <div className="bg-gradient-to-br from-red-600/20 to-zinc-400/12 rounded-xl p-8 flex flex-col items-center justify-center border-2 border-dashed border-red-500">
                  <img
                    src="https://images.unsplash.com/photo-1646181868801-17e68a0e8cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaWZ0JTIwYm94JTIwbXlzdGVyeSUyMHBhY2thZ2V8ZW58MXx8fHwxNzc0NDcyMDI2fDA&ixlib=rb-4.1.0&q=80&w=400"
                    alt="Mystery box"
                    className="w-40 h-40 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold mb-2">Mystery Shirt Box</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Your surprise awaits inside!
                  </p>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-3 border-b border-border">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-bold">{selectedSize}</span>
                    </div>
                    
                    {exclusions.clubs.length > 0 && (
                      <div className="pb-3 border-b border-border">
                        <span className="text-muted-foreground mb-2 block">Excluded Clubs</span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.clubs.map((club) => (
                            <span key={club} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                              {club}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {exclusions.leagues.length > 0 && (
                      <div className="pb-3 border-b border-border">
                        <span className="text-muted-foreground mb-2 block">Excluded Leagues</span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.leagues.map((league) => (
                            <span key={league} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                              {league}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {exclusions.colors.length > 0 && (
                      <div className="pb-3 border-b border-border">
                        <span className="text-muted-foreground mb-2 block">Excluded Colors</span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.colors.map((color) => (
                            <span key={color} className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-muted-foreground">Mystery Shirt</span>
                      <span className="font-bold">$29.99</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-bold">$4.99</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-xl pt-3 border-t border-border">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-red-500">$34.98</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-bold"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}


