import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Download, FileText, Loader2, Receipt } from "lucide-react";
import { fetchAdminOrderDetails } from "../services/adminApi";
import type { AdminOrderDetailsResponse } from "../types";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Button } from "../../web/components/ui/button";

interface BillingDetails {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function toStringValue(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim();
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatProviderLabel(provider: string | null | undefined): string {
  const value = (provider ?? "").trim();
  if (!value) return "-";
  if (value.toLowerCase() === "cod") return "COD";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function capitalizeValue(value: string | null | undefined): string {
  const normalized = (value ?? "").trim();
  if (!normalized) return "-";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function AdminOrderDetailsPage() {
  const { orderId = "" } = useParams();
  const [data, setData] = useState<AdminOrderDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!orderId) {
        setError("Missing order id.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchAdminOrderDetails({ orderId });
        if (!isMounted) return;
        setData(response);
      } catch (requestError) {
        if (!isMounted) return;
        setError(requestError instanceof Error ? requestError.message : "Failed to load order details.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void run();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  const order = data?.order ?? null;
  const transactions = data?.transactions ?? [];
  const billing = useMemo<BillingDetails>(() => {
    const raw = toRecord(order?.raw?.billing);
    return {
      fullName: toStringValue(raw.fullName),
      email: toStringValue(raw.email),
      phone: toStringValue(raw.phone),
      addressLine1: toStringValue(raw.addressLine1),
      addressLine2: toStringValue(raw.addressLine2),
      city: toStringValue(raw.city),
      state: toStringValue(raw.state),
      postalCode: toStringValue(raw.postalCode),
      country: toStringValue(raw.country),
    };
  }, [order?.raw]);
  const exclusions = useMemo(() => {
    const raw = toRecord(order?.raw?.exclusions);
    return {
      clubs: toStringArray(raw.clubs),
      leagues: toStringArray(raw.leagues),
      colors: toStringArray(raw.colors),
    };
  }, [order?.raw]);
  const buildInvoiceHtml = (invoiceNumber: string) => {
    if (!order) return "";
    const activeOrder = order;
    const formattedCreatedAt = formatDateTime(activeOrder.createdAt);
    const brandLogoUrl = `${window.location.origin}/assets/logos/BLACK_LOGO.svg`;
    const brandIconUrl = `${window.location.origin}/assets/icons/ICON_WHITE.svg`;
    const renderExclusionValues = (values: string[]) =>
      values.length ? escapeHtml(values.map((value) => capitalizeValue(value)).join(", ")) : "None";

    const exclusionsHtml = `
      <div class="exclusions-grid">
        <div class="exclusion-row">
          <div class="exclusion-label">Clubs</div>
          <div class="exclusion-values">${renderExclusionValues(exclusions.clubs)}</div>
        </div>
        <div class="exclusion-row">
          <div class="exclusion-label">Leagues</div>
          <div class="exclusion-values">${renderExclusionValues(exclusions.leagues)}</div>
        </div>
        <div class="exclusion-row">
          <div class="exclusion-label">Colors</div>
          <div class="exclusion-values">${renderExclusionValues(exclusions.colors)}</div>
        </div>
      </div>
    `;

    const txRows = transactions
      .map(
        (tx) => `
          <tr>
            <td>${escapeHtml(capitalizeValue(tx.type))}</td>
            <td>${escapeHtml(capitalizeValue(tx.status))}</td>
            <td>${escapeHtml(`${tx.amount} ${tx.currency}`)}</td>
            <td>${escapeHtml(formatDateTime(tx.createdAt))}</td>
          </tr>
        `,
      )
      .join("");

    return `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(invoiceNumber)}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #111827; margin: 32px; }
            h1, h2, h3 { margin: 0; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
            .brand { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; }
            .brand-logo { height: 30px; width: auto; }
            .brand-icon-wrap { height: 34px; width: 34px; border-radius: 10px; background: #111827; display: inline-flex; align-items: center; justify-content: center; }
            .brand-icon { height: 20px; width: 20px; }
            .muted { color: #6b7280; font-size: 12px; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
            .row { margin: 6px 0; }
            .label { color: #6b7280; font-size: 12px; }
            .value { font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; text-align: left; padding: 8px; font-size: 12px; }
            th { background: #f9fafb; }
            .footer { margin-top: 20px; color: #6b7280; font-size: 11px; text-align: right; }
            .exclusions-grid { display: grid; gap: 10px; margin-top: 10px; }
            .exclusion-row { display: grid; grid-template-columns: 90px 1fr; gap: 10px; align-items: start; }
            .exclusion-label { font-size: 12px; font-weight: 600; color: #374151; padding-top: 2px; }
            .exclusion-values { font-size: 13px; color: #111827; line-height: 1.45; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">
              <img class="brand-logo" src="${escapeHtml(brandLogoUrl)}" alt="unboxd" />
              <div class="muted">Official order invoice</div>
            </div>
            <div style="text-align:right">
              <h2>${escapeHtml(invoiceNumber)}</h2>
              <div class="muted">Order: ${escapeHtml(activeOrder.id)}</div>
              <div class="muted">Date: ${escapeHtml(formattedCreatedAt)}</div>
            </div>
          </div>

          <div class="grid">
            <div class="card">
              <h3>Billing</h3>
              <div class="row"><div class="label">Name</div><div class="value">${escapeHtml(capitalizeValue(billing.fullName))}</div></div>
              <div class="row"><div class="label">Email</div><div class="value">${escapeHtml(billing.email || "-")}</div></div>
              <div class="row"><div class="label">Phone</div><div class="value">${escapeHtml(billing.phone || "-")}</div></div>
              <div class="row"><div class="label">Address</div><div class="value">${escapeHtml(capitalizeValue([billing.addressLine1, billing.addressLine2].filter(Boolean).join(", ")))}</div></div>
              <div class="row"><div class="label">City / Country</div><div class="value">${escapeHtml(capitalizeValue([billing.city, billing.state, billing.postalCode].filter(Boolean).join(", ")))} ${escapeHtml(capitalizeValue(billing.country))}</div></div>
            </div>
            <div class="card">
              <h3>Order</h3>
              <div class="row"><div class="label">Buyer</div><div class="value">${escapeHtml(capitalizeValue(activeOrder.buyerName))}</div></div>
              <div class="row"><div class="label">Provider</div><div class="value">${escapeHtml(formatProviderLabel(activeOrder.provider))}</div></div>
              <div class="row"><div class="label">Size</div><div class="value">${escapeHtml(capitalizeValue(activeOrder.size))}</div></div>
              <div class="row"><div class="label">Status</div><div class="value">${escapeHtml(capitalizeValue(activeOrder.status))}</div></div>
              <div class="row"><div class="label">Payment</div><div class="value">${escapeHtml(capitalizeValue(activeOrder.paymentState))}</div></div>
              <div class="row"><div class="label">Amount</div><div class="value">${escapeHtml(`${activeOrder.amount} ${activeOrder.currency}`)}</div></div>
            </div>
          </div>

          <div class="card">
            <h3>Exclusions</h3>
            ${exclusionsHtml}
          </div>

          <h3>Transactions</h3>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              ${txRows || '<tr><td colspan="4">No linked transactions</td></tr>'}
            </tbody>
          </table>

          <div class="footer">
            <span>Generated by unboxd admin</span>
            <span class="brand-icon-wrap"><img class="brand-icon" src="${escapeHtml(brandIconUrl)}" alt="unboxd icon" /></span>
          </div>
        </body>
      </html>
    `;
  };

  const openInvoice = () => {
    if (!order) return;

    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const invoiceHtml = buildInvoiceHtml(invoiceNumber);

    const popup = window.open("", "_blank");
    if (!popup) return;
    popup.opener = null;
    popup.document.open();
    popup.document.write(invoiceHtml);
    popup.document.close();
    popup.focus();
  };

  const handleGenerateInvoice = () => {
    openInvoice();
  };

  const handleDownloadInvoicePdf = async () => {
    if (!order) return;

    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const invoiceHtml = buildInvoiceHtml(invoiceNumber);
    const parsed = new DOMParser().parseFromString(invoiceHtml, "text/html");
    const invoiceStyles = parsed.querySelector("style")?.textContent ?? "";

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "794px";
    container.style.background = "#ffffff";
    container.style.pointerEvents = "none";

    const styleTag = document.createElement("style");
    styleTag.textContent = invoiceStyles;
    container.appendChild(styleTag);

    const root = document.createElement("div");
    root.innerHTML = parsed.body.innerHTML;
    container.appendChild(root);
    document.body.appendChild(container);

    try {
      const images = Array.from(container.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
        ),
      );

      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      await new Promise<void>((resolve) => {
        doc.html(root, {
          margin: [20, 20, 20, 20],
          autoPaging: "text",
          width: 555,
          windowWidth: 794,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
          },
          callback: (instance) => {
            instance.save(`${invoiceNumber}.pdf`);
            resolve();
          },
        });
      });
    } finally {
      container.remove();
    }
  };

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/orders">
            <ArrowLeft className="h-4 w-4" />
            Back to orders
          </Link>
        </Button>
      </div>

      <AdminPageHeader
        title={order ? `Order ${order.id}` : "Order details"}
        description="Full order payload with operational statuses and linked transactions."
        isRefreshing={isLoading}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={!order || isLoading} onClick={handleGenerateInvoice}>
              <FileText className="h-4 w-4" />
              Generate invoice
            </Button>
            <Button type="button" variant="outline" size="sm" disabled={!order || isLoading} onClick={handleDownloadInvoicePdf}>
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
        onRefresh={() => {
          setData(null);
          setIsLoading(true);
          setError(null);
          void fetchAdminOrderDetails({ orderId })
            .then((response) => setData(response))
            .catch((requestError) => {
              setError(requestError instanceof Error ? requestError.message : "Failed to refresh order details.");
            })
            .finally(() => setIsLoading(false));
        }}
      />

      {error ? <AdminErrorAlert message={error} /> : null}

      {isLoading ? (
        <div className="mt-5 rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="font-medium text-foreground">Loading order details</span>
            <span className="text-xs text-muted-foreground">Fetching latest order and transaction data...</span>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="rounded-xl border border-border/70 bg-accent/20 p-4">
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="mt-3 h-6 w-28 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-border/70 p-4">
            <div className="h-4 w-36 animate-pulse rounded bg-muted" />
            <div className="mt-3 space-y-2">
              {[0, 1, 2, 3].map((row) => (
                <div key={row} className="h-9 animate-pulse rounded bg-accent/30" />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && order ? (
        <div className="mt-5 space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Status</p>
              <div className="mt-2">
                <AdminStatusBadge value={order.status} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payment</p>
              <div className="mt-2">
                <AdminStatusBadge value={order.paymentState} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Reconciliation</p>
              <div className="mt-2">
                <AdminStatusBadge value={order.reconciliationStatus} />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount</p>
              <p className="mt-2 text-base font-semibold">
                {order.amount} {order.currency}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <th className="w-40 bg-accent/20 px-3 py-2 text-left text-muted-foreground sm:w-56">Order ID</th>
                  <td className="px-3 py-2 font-mono text-xs break-all">{order.id}</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="bg-accent/20 px-3 py-2 text-left text-muted-foreground">Buyer</th>
                  <td className="px-3 py-2">
                    <p>{order.buyerName ?? "-"}</p>
                    <p className="font-mono text-xs text-muted-foreground break-all">{order.buyerUid}</p>
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <th className="bg-accent/20 px-3 py-2 text-left text-muted-foreground">Buyer Email</th>
                  <td className="px-3 py-2 break-all">{order.buyerEmail ?? "-"}</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="bg-accent/20 px-3 py-2 text-left text-muted-foreground">Provider</th>
                  <td className="px-3 py-2">{formatProviderLabel(order.provider)}</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="bg-accent/20 px-3 py-2 text-left text-muted-foreground">Size</th>
                  <td className="px-3 py-2">{order.size || "-"}</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="bg-accent/20 px-3 py-2 text-left text-muted-foreground">Created At</th>
                  <td className="px-3 py-2">{formatDateTime(order.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-medium">Billing</h3>
              <div className="mt-3 grid gap-3 rounded-md bg-accent/20 p-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="text-sm">{billing.fullName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{billing.email || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm">{billing.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Country</p>
                  <p className="text-sm">{billing.country || "-"}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">
                    {[billing.addressLine1, billing.addressLine2, billing.city, billing.state, billing.postalCode]
                      .filter(Boolean)
                      .join(", ") || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-medium">Exclusions</h3>
              <div className="mt-3 space-y-3 rounded-md bg-accent/20 p-3">
                <div>
                  <p className="text-xs text-muted-foreground">Clubs</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {exclusions.clubs.length > 0 ? exclusions.clubs.map((club) => (
                      <span key={club} className="rounded-full border border-border/70 px-2 py-0.5 text-xs">
                        {club}
                      </span>
                    )) : <span className="text-sm">-</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Leagues</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {exclusions.leagues.length > 0 ? exclusions.leagues.map((league) => (
                      <span key={league} className="rounded-full border border-border/70 px-2 py-0.5 text-xs">
                        {league}
                      </span>
                    )) : <span className="text-sm">-</span>}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Colors</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {exclusions.colors.length > 0 ? exclusions.colors.map((color) => (
                      <span key={color} className="rounded-full border border-border/70 px-2 py-0.5 text-xs">
                        {color}
                      </span>
                    )) : <span className="text-sm">-</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium">Related Transactions</h3>
            </div>
            {transactions.length === 0 ? (
              <AdminEmptyState
                icon={Receipt}
                title="No linked transactions"
                subtitle="This order has no related transactions yet."
                className="py-10"
              />
            ) : (
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-accent/30 text-left text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Transaction</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="hidden px-3 py-2 md:table-cell">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-t border-border">
                      <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{tx.id}</td>
                      <td className="px-3 py-2">{tx.type || "-"}</td>
                      <td className="px-3 py-2">
                        <AdminStatusBadge value={tx.status} />
                      </td>
                      <td className="px-3 py-2">
                        {tx.amount} {tx.currency}
                      </td>
                      <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(tx.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
