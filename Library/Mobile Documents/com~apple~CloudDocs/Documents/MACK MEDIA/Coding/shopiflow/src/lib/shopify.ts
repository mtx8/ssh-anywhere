import type { ShopifyCredentials, ShopifyProductSummary, ShopifyStoreInfo } from "./types";

const API_VERSION = "2024-01";
const PROXY_URL =
    import.meta.env.VITE_SHOPIFY_PROXY_URL?.trim() ?? (import.meta.env.DEV ? "/__shopify" : undefined);

export function normalizeStoreDomain(raw: string): string {
    return raw
        .trim()
        .replace(/^https?:\/\//i, "")
        .replace(/\/$/, "");
}

function buildAdminUrl(domain: string, path: string): string {
    const normalized = normalizeStoreDomain(domain);
    return `https://${normalized}/admin/api/${API_VERSION}${path}`;
}

async function requestAdmin<T>(credentials: ShopifyCredentials, path: string, init?: RequestInit): Promise<T> {
    const url = buildAdminUrl(credentials.storeDomain, path);
    const headers = {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": credentials.accessToken,
        ...(init?.headers ?? {}),
    } as Record<string, string>;

    // Optional proxy support when running outside Framer
    if (PROXY_URL) {
        try {
            const proxyResponse = await fetch(`${PROXY_URL}/admin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url,
                    method: init?.method ?? "GET",
                    headers,
                    body: init?.body ? String(init.body) : undefined,
                }),
            });

            if (proxyResponse.ok) {
                return (await proxyResponse.json()) as T;
            }
            console.warn("Proxy request failed, falling back to direct request", proxyResponse.statusText);
        } catch (error) {
            console.warn("Proxy request error, falling back to direct request", error);
        }
    }

    const response = await fetch(url, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`${response.status} ${response.statusText}: ${text}`);
    }
    return (await response.json()) as T;
}

export async function verifyCredentials(credentials: ShopifyCredentials): Promise<ShopifyStoreInfo> {
    const data = await requestAdmin<{ shop: { name: string; domain: string; email?: string } }>(
        credentials,
        "/shop.json",
    );
    return {
        name: data.shop.name,
        domain: data.shop.domain,
        email: data.shop.email,
    };
}

export interface FetchProductsOptions {
    limit?: number;
}

interface ShopifyVariantResponse {
    id: string | number;
    price?: string;
    sku?: string;
    currency?: string;
    currency_code?: string;
    inventory_quantity?: number;
}

interface ShopifyProductResponse {
    id: string | number;
    title: string;
    handle?: string;
    status?: string;
    published_at?: string | null;
    body_html?: string | null;
    product_type?: string | null;
    vendor?: string | null;
    tags?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    image?: { src?: string | null } | null;
    images?: Array<{ src?: string | null }>;
    variants?: ShopifyVariantResponse[];
}

export async function fetchProducts(
    credentials: ShopifyCredentials,
    options: FetchProductsOptions = {},
): Promise<ShopifyProductSummary[]> {
    const data = await requestAdmin<{ products: ShopifyProductResponse[] }>(
        credentials,
        `/products.json?limit=${options.limit ?? 50}`,
    );

    return data.products.map((product) => {
        const variants: ShopifyVariantResponse[] = Array.isArray(product.variants) ? product.variants : [];
        const primaryVariant = variants[0];
        const totalInventory = variants.reduce((sum: number, variant) => {
            const qty = typeof variant?.inventory_quantity === "number" ? variant.inventory_quantity : 0;
            return sum + qty;
        }, 0);
        const tags =
            typeof product.tags === "string"
                ? product.tags
                      .split(",")
                      .map((tag: string) => tag.trim())
                      .filter(Boolean)
                : undefined;
        const currency = primaryVariant?.currency ?? primaryVariant?.currency_code ?? "USD";
        const onlineStoreUrl =
            product.handle != null && product.handle !== ""
                ? `https://${normalizeStoreDomain(credentials.storeDomain)}/products/${product.handle}`
                : undefined;

        return {
            id: String(product.id),
            title: product.title,
            handle: product.handle ?? String(product.id),
            status: product.status ?? (product.published_at ? "active" : "draft"),
            variants: variants.length,
            price: primaryVariant?.price != null ? formatMoney(primaryVariant.price, currency) : "$0.00",
            image: product.image?.src ?? product.images?.[0]?.src ?? undefined,
            descriptionHtml: product.body_html ?? undefined,
            totalInventory: totalInventory > 0 ? totalInventory : undefined,
            productType: product.product_type ?? undefined,
            sku: primaryVariant?.sku ?? undefined,
            tags,
            vendor: product.vendor ?? undefined,
            createdAt: product.created_at ?? undefined,
            updatedAt: product.updated_at ?? undefined,
            onlineStoreUrl,
        };
    });
}

function formatMoney(amount: string, currency: string): string {
    const numeric = Number.parseFloat(amount);
    if (!Number.isFinite(numeric)) {
        return amount;
    }

    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(numeric);
    } catch {
        return `$${numeric.toFixed(2)}`;
    }
}
