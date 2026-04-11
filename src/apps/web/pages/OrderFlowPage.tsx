import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  ChevronsUpDown,
  ShieldOff,
  Package2,
  Palette,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../store/hooks";
import { Spinner } from "../components/ui/spinner";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import {
  createOrder,
  type BillingDetails,
  type PaymentProvider,
} from "../services/paymentsService";
import { mapFirebaseError } from "../services/errorService";

type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";

interface Exclusions {
  clubs: string[];
  leagues: string[];
  colors: string[];
}

const ORDER_STEP_PATHS = ["size", "avoidants", "summary", "checkout"] as const;
type OrderStepPath = (typeof ORDER_STEP_PATHS)[number];

countries.registerLocale(enLocale);

const isOrderStepPath = (value: string): value is OrderStepPath =>
  ORDER_STEP_PATHS.includes(value as OrderStepPath);

export function OrderFlowPage() {
  const navigate = useNavigate();
  const params = useParams<{ step: string }>();
  const user = useAppSelector((state) => state.auth.user);
  const wishEnabled = import.meta.env.VITE_WISH_ENABLED === "true";
  const envDefaultProvider = (import.meta.env.VITE_PAYMENT_PROVIDER_DEFAULT ||
    "cod") as PaymentProvider;
  const defaultProvider: PaymentProvider =
    envDefaultProvider === "wish" && wishEnabled ? "wish" : "cod";

  const steps = [
    "Select Size",
    "Avoidants",
    "Summary",
    "Payment",
    "Success",
  ];
  const sizes: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];
  const popularClubs = [
    "Real Madrid",
    "Barcelona",
    "Manchester United",
    "Liverpool",
    "Bayern Munich",
    "PSG",
    "Juventus",
    "AC Milan",
  ];
  const leagues = [
    "Premier League",
    "La Liga",
    "Serie A",
    "Bundesliga",
    "Ligue 1",
    "MLS",
    "Liga MX",
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

  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutSuccess, setCheckoutSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [paymentProvider, setPaymentProvider] =
    useState<PaymentProvider>(defaultProvider);
  const [billing, setBilling] = useState<BillingDetails>({
    fullName: "",
    email: user?.email ?? "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Lebanon",
  });
  const [exclusions, setExclusions] = useState<Exclusions>({
    clubs: [],
    leagues: [],
    colors: [],
  });

  const currentStepPath = useMemo<OrderStepPath>(() => {
    const candidate = (params.step ?? "size").toLowerCase();
    return isOrderStepPath(candidate) ? candidate : "size";
  }, [params.step]);

  const currentStep = ORDER_STEP_PATHS.indexOf(currentStepPath) + 1;
  const countryOptions = useMemo(() => {
    const names = countries.getNames("en", { select: "official" });
    return Object.entries(names)
      .map(([code, name]) => ({ code, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const resetOrderSelections = () => {
    setSelectedSize(null);
    setExclusions({ clubs: [], leagues: [], colors: [] });
    setCheckoutError("");
    setCheckoutSuccess("");
  };

  const goToStep = (
    nextStep: OrderStepPath,
    options?: { resetSelections?: boolean },
  ) => {
    if (options?.resetSelections) {
      resetOrderSelections();
    }
    setCheckoutError("");
    navigate(`/order/${nextStep}`);
  };

  useEffect(() => {
    const candidate = (params.step ?? "").toLowerCase();
    if (!isOrderStepPath(candidate)) {
      navigate("/order/size", { replace: true });
    }
  }, [navigate, params.step]);

  useEffect(() => {
    if (!selectedSize && currentStepPath !== "size") {
      navigate("/order/size", { replace: true });
    }
  }, [currentStepPath, navigate, selectedSize]);

  useEffect(() => {
    if (!billing.email && user?.email) {
      setBilling((prev) => ({ ...prev, email: user.email }));
    }
  }, [billing.email, user?.email]);

  const toggleClub = (club: string) => {
    setExclusions((prev) => ({
      ...prev,
      clubs: prev.clubs.includes(club)
        ? prev.clubs.filter((c) => c !== club)
        : [...prev.clubs, club],
    }));
  };

  const toggleLeague = (league: string) => {
    setExclusions((prev) => ({
      ...prev,
      leagues: prev.leagues.includes(league)
        ? prev.leagues.filter((l) => l !== league)
        : [...prev.leagues, league],
    }));
  };

  const toggleColor = (color: string) => {
    setExclusions((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const updateBillingField = (field: keyof BillingDetails, value: string) => {
    setBilling((prev) => ({ ...prev, [field]: value }));
  };

  const missingBillingFields = () => {
    const required: Array<keyof BillingDetails> = [
      "fullName",
      "email",
      "phone",
      "addressLine1",
      "city",
      "state",
      "country",
    ];
    return required.filter((field) => !billing[field]?.trim());
  };

  const isEmailValid = () =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billing.email.trim());

  const validateBilling = () => {
    const missingFields = missingBillingFields();
    if (missingFields.length > 0) {
      return "Please complete all required billing and contact details.";
    }
    if (!isEmailValid()) {
      return "Please enter a valid billing email address.";
    }
    return "";
  };

  const isCheckoutReady =
    Boolean(user) && missingBillingFields().length === 0 && isEmailValid();

  const redirectToPayment = (url: string) => {
    const target = new URL(url, window.location.origin).toString();

    // In embedded/sandboxed frames, direct navigation can be blocked by the browser.
    // A new-tab redirect from this click interaction is more reliable.
    if (window.self !== window.top) {
      const opened = window.open(target, "_blank", "noopener,noreferrer");
      if (opened) return;
    }

    window.location.assign(target);
  };

  const handleCheckout = async () => {
    if (!selectedSize) return;

    if (!user) {
      setCheckoutError("You must be signed in to place an order.");
      return;
    }

    const billingError = validateBilling();
    if (billingError) {
      setCheckoutError(billingError);
      return;
    }

    const normalizedProvider: PaymentProvider =
      paymentProvider === "wish" && wishEnabled ? "wish" : "cod";

    setCheckoutError("");
    setCheckoutSuccess("");
    setIsSubmitting(true);

    try {
      const result = await createOrder({
        size: selectedSize,
        exclusions,
        paymentProvider: normalizedProvider,
        billing: {
          fullName: billing.fullName.trim(),
          email: billing.email.trim(),
          phone: billing.phone.trim(),
          addressLine1: billing.addressLine1.trim(),
          addressLine2: billing.addressLine2?.trim(),
          city: billing.city.trim(),
          state: billing.state?.trim(),
          postalCode: billing.postalCode?.trim(),
          country: billing.country.trim(),
        },
      });

      if ("redirectUrl" in result) {
        setCheckoutSuccess(
          "Whish payment initialized. Redirecting to payment...",
        );
        redirectToPayment(result.redirectUrl);
        return;
      }

      navigate(`/order/success?orderId=${encodeURIComponent(result.orderId)}`);
    } catch (error) {
      setCheckoutError(mapFirebaseError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mx-auto mb-12 flex w-full max-w-3xl flex-col items-center">
          <div className="w-full">
            <div className="mb-4 hidden items-center justify-center sm:flex">
              {steps.map((_, index) => {
                const s = index + 1;
                return (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all md:h-10 md:w-10 md:text-base ${
                        s === currentStep
                          ? "bg-gradient-to-br from-rose-500 to-red-700 text-white"
                          : s < currentStep
                            ? "bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s < currentStep ? <Check className="h-5 w-5" /> : s}
                    </div>
                    {s < steps.length && (
                      <div
                        className={`mx-2 h-1 w-20 rounded transition-all md:w-28 lg:w-32 ${s < currentStep ? "bg-green-500" : "bg-muted"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mb-4 space-y-2 sm:hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-700 transition-all"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
            <div className="hidden grid-cols-5 text-sm text-muted-foreground sm:grid">
              {steps.map((label) => (
                <span key={label} className="justify-self-center whitespace-nowrap">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground sm:hidden">
            {steps[currentStep - 1]}
          </p>
        </div>

        {currentStepPath === "size" && (
          <motion.div
            key="size"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-2 text-3xl font-bold">Select Your Size</h2>
              <p className="mb-8 text-muted-foreground">
                Choose the size that fits you best
              </p>

              <div className="mb-8 grid grid-cols-3 gap-4 md:grid-cols-6">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-16 items-center justify-center rounded-lg border-2 px-2 py-3 transition-all sm:h-20 sm:px-3 sm:py-4 md:h-auto md:p-6 ${
                      selectedSize === size
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/50"
                    }`}
                  >
                    <span className="text-lg font-bold sm:text-xl">{size}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToStep("avoidants")}
                disabled={!selectedSize}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-4 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to Avoidants
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        )}

        {currentStepPath === "avoidants" && (
          <motion.div
            key="avoidants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-2 text-3xl font-bold">Set Your Avoidants</h2>
              <p className="mb-8 text-muted-foreground">
                Optional: avoid specific teams, leagues, or colors
              </p>

              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <ShieldOff className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Clubs</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {popularClubs.map((club) => (
                    <button
                      key={club}
                      onClick={() => toggleClub(club)}
                      className={`rounded-lg border p-3 text-sm transition-all ${
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

              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Leagues</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {leagues.map((league) => (
                    <button
                      key={league}
                      onClick={() => toggleLeague(league)}
                      className={`rounded-lg border p-3 text-sm transition-all ${
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

              <div className="mb-8">
                <div className="mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-red-500" />
                  <h3 className="text-xl font-bold">Avoid Colors</h3>
                </div>
                <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
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
                          <X className="h-6 w-6 rounded-full bg-white text-red-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() =>
                    goToStep("size", {
                      resetSelections: true,
                    })
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-accent-foreground transition-colors hover:bg-accent/80 sm:w-auto"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={() => goToStep("summary")}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-4 text-white transition-all hover:shadow-lg"
                >
                  Continue to Summary
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStepPath === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-2 text-3xl font-bold">Order Summary</h2>
              <p className="mb-8 text-muted-foreground">
                Review what you are ordering before payment
              </p>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-red-500 bg-gradient-to-br from-red-600/20 to-zinc-400/12 p-8">
                  <img
                    src="/assets/images/jersey.jpg"
                    alt="Mystery box"
                    className="mb-4 h-40 w-40 rounded-lg object-cover"
                  />
                  <h3 className="mb-2 text-xl font-bold">Mystery Shirt Box</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Your surprise awaits inside
                  </p>
                </div>

                <div>
                  <h3 className="mb-4 text-xl font-bold">Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">Size</span>
                      <span className="font-bold">{selectedSize}</span>
                    </div>
                    {exclusions.clubs.length > 0 && (
                      <div className="border-b border-border pb-3">
                        <span className="mb-2 block text-muted-foreground">
                          Avoid Clubs
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.clubs.map((club) => (
                            <span
                              key={club}
                              className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-500"
                            >
                              {club}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exclusions.leagues.length > 0 && (
                      <div className="border-b border-border pb-3">
                        <span className="mb-2 block text-muted-foreground">
                          Avoid Leagues
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.leagues.map((league) => (
                            <span
                              key={league}
                              className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-500"
                            >
                              {league}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {exclusions.colors.length > 0 && (
                      <div className="border-b border-border pb-3">
                        <span className="mb-2 block text-muted-foreground">
                          Avoid Colors
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {exclusions.colors.map((color) => (
                            <span
                              key={color}
                              className="rounded bg-red-500/10 px-2 py-1 text-xs text-red-500"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">
                        Mystery Shirt
                      </span>
                      <span className="font-bold">$29.99</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-bold">$4.99</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 text-xl">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-red-500">$34.98</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => goToStep("avoidants")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-accent-foreground transition-colors hover:bg-accent/80 sm:w-auto"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={() => goToStep("checkout")}
                  className="flex w-full flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-4 text-white transition-all hover:shadow-lg"
                >
                  Continue to Payment
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {currentStepPath === "checkout" && (
          <motion.div
            key="checkout"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="rounded-xl border border-border bg-card p-8">
              <h2 className="mb-2 text-3xl font-bold">Payment & Billing</h2>
              <p className="mb-8 text-muted-foreground">
                Select payment and enter billing details on this step
              </p>

              <div className="mb-8 rounded-lg border border-border p-4">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Payment Method
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentProvider("cod")}
                    className={`rounded-lg border px-4 py-3 text-left transition-all ${
                      paymentProvider === "cod"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/40"
                    }`}
                  >
                    <p className="font-semibold">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">
                      Pay in cash when your mystery shirt arrives.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => wishEnabled && setPaymentProvider("wish")}
                    disabled={!wishEnabled}
                    className={`rounded-lg border px-4 py-3 text-left transition-all ${
                      paymentProvider === "wish"
                        ? "border-red-500 bg-red-500/10"
                        : "border-border hover:border-red-500/40"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    <p className="font-semibold">Whish</p>
                    <p className="text-xs text-muted-foreground">
                      {wishEnabled
                        ? "Pay securely with Whish checkout."
                        : "Whish is temporarily unavailable."}
                    </p>
                  </button>
                </div>
              </div>

              <div className="mb-8 rounded-xl border border-border p-5">
                <h3 className="mb-4 text-xl font-bold">
                  Billing & Contact Details
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Full name *
                    </span>
                    <input
                      type="text"
                      value={billing.fullName}
                      onChange={(event) =>
                        updateBillingField("fullName", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="Saint Iker"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Billing email *
                    </span>
                    <input
                      type="email"
                      value={billing.email}
                      onChange={(event) =>
                        updateBillingField("email", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="you@example.com"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Phone number *
                    </span>
                    <input
                      type="tel"
                      value={billing.phone}
                      onChange={(event) =>
                        updateBillingField("phone", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="+961 000 000"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Country *
                    </span>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="flex h-11 w-full items-center justify-between rounded-lg border border-border bg-accent px-3 pr-4 text-left text-base font-normal outline-none transition-all focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-0"
                        >
                          <span className={billing.country ? "" : "text-muted-foreground"}>
                            {billing.country || "Select country"}
                          </span>
                          <ChevronsUpDown className="ml-2 inline h-4 w-4 shrink-0 text-[var(--brand-light-purple)]/90 opacity-80" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-[var(--radix-popover-trigger-width)] border-border bg-[var(--brand-dark-azure)] p-0 text-[var(--brand-light-purple)]"
                      >
                        <Command className="bg-transparent text-inherit">
                          <CommandInput placeholder="Search country..." />
                          <CommandList className="thin-white-scrollbar max-h-64">
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                              {countryOptions.map((country) => (
                                <CommandItem
                                  key={country.code}
                                  value={`${country.name} ${country.code}`}
                                  onSelect={() => {
                                    updateBillingField("country", country.name);
                                    setCountryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={`h-4 w-4 ${billing.country === country.name ? "opacity-100" : "opacity-0"}`}
                                  />
                                  <span>{country.name}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block text-muted-foreground">
                      Address line 1 *
                    </span>
                    <input
                      type="text"
                      value={billing.addressLine1}
                      onChange={(event) =>
                        updateBillingField("addressLine1", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="123 Main St"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block text-muted-foreground">
                      Address line 2
                    </span>
                    <input
                      type="text"
                      value={billing.addressLine2}
                      onChange={(event) =>
                        updateBillingField("addressLine2", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="Apartment, suite, unit, etc."
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      City *
                    </span>
                    <input
                      type="text"
                      value={billing.city}
                      onChange={(event) =>
                        updateBillingField("city", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="Beirut"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Governorate *
                    </span>
                    <input
                      type="text"
                      value={billing.state}
                      onChange={(event) =>
                        updateBillingField("state", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="Mount Lebanon"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block text-muted-foreground">
                      Postal code
                    </span>
                    <input
                      type="text"
                      value={billing.postalCode}
                      onChange={(event) =>
                        updateBillingField("postalCode", event.target.value)
                      }
                      className="h-11 w-full rounded-lg border border-border bg-accent px-3 outline-none transition-all focus:border-red-500"
                      placeholder="1107 2800"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={() => goToStep("summary")}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 text-accent-foreground transition-colors hover:bg-accent/80 sm:w-auto"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Back
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitting || !isCheckoutReady}
                  className="inline-flex w-full flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-4 font-bold text-white transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4" tone="black" />
                      <span className="loading-shimmer-text-light">Processing</span>
                    </>
                  ) : paymentProvider === "wish" ? (
                    "Proceed to Whish"
                  ) : (
                    "Place COD Order"
                  )}
                </button>
              </div>

              {checkoutError && (
                <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {checkoutError}
                </p>
              )}
              {checkoutSuccess && (
                <p className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                  {checkoutSuccess}
                </p>
              )}
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
