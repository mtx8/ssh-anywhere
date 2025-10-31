import { Buffer } from "node:buffer"
import type { IncomingMessage, ServerResponse } from "node:http"
import { defineConfig, type Plugin, type ViteDevServer } from "vite"
import react from "@vitejs/plugin-react-swc"
import mkcert from "vite-plugin-mkcert"
import framer from "vite-plugin-framer"
import path from "path"

interface ShopifyProxyRequestPayload {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

type ProxyRequest = IncomingMessage & { method?: string };

function createShopifyProxyPlugin(): Plugin {
    const forbiddenHeaders = new Set(["host", "origin", "referer", "content-length"]);

    return {
        name: "shopiflow-shopify-proxy",
        apply: "serve" as const,
        configureServer(server: ViteDevServer) {
            server.middlewares.use("/__shopify", async (req: ProxyRequest, res: ServerResponse) => {
                if (req.method === "OPTIONS") {
                    res.statusCode = 204;
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
                    res.end();
                    return;
                }

                if (req.method !== "POST") {
                    res.statusCode = 405;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Method not allowed" }));
                    return;
                }

                try {
                    const chunks: Uint8Array[] = [];
                    for await (const chunk of req) {
                        chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
                    }
                    const rawBody = Buffer.concat(chunks).toString("utf-8");
                    const payload: ShopifyProxyRequestPayload = rawBody ? JSON.parse(rawBody) : {};

                    const targetUrl: string | undefined = payload?.url;
                    if (!targetUrl || typeof targetUrl !== "string") {
                        throw new Error("Missing target URL");
                    }

                    const method: string = payload?.method ?? "GET";
                    const incomingHeaders: Record<string, string> = payload?.headers ?? {};
                    const headers: Record<string, string> = {};
                    for (const [key, value] of Object.entries(incomingHeaders)) {
                        if (!value || forbiddenHeaders.has(key.toLowerCase())) continue;
                        headers[key] = value;
                    }

                    const body: string | undefined =
                        typeof payload.body === "string" && payload.body !== "undefined"
                            ? payload.body
                            : undefined;

                    const response = await fetch(targetUrl, {
                        method,
                        headers,
                        body: body ? Buffer.from(body) : undefined,
                    });

                    const responseBody = await response.text();

                    res.statusCode = response.status;
                    res.statusMessage = response.statusText;
                    res.setHeader("Access-Control-Allow-Origin", "*");
                    res.setHeader("Cache-Control", "no-store");

                    const contentType = response.headers.get("content-type");
                    if (contentType) {
                        res.setHeader("Content-Type", contentType);
                    }

                    res.end(responseBody);
                } catch (error) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                        JSON.stringify({
                            error: "Shopify proxy request failed",
                            message: error instanceof Error ? error.message : String(error),
                        }),
                    );
                }
            });
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), mkcert(), framer(), createShopifyProxyPlugin()],
    server: {
        https: true,
        host: "127.0.0.1",
        port: Number(process.env.PORT ?? 5173),
        cors: true,
        strictPort: false,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            "vaul@1.1.2": "vaul",
            "sonner@2.0.3": "sonner",
            "recharts@2.15.2": "recharts",
            "react-resizable-panels@2.1.7": "react-resizable-panels",
            "react-hook-form@7.55.0": "react-hook-form",
            "react-day-picker@8.10.1": "react-day-picker",
            "next-themes@0.4.6": "next-themes",
            "lucide-react@0.487.0": "lucide-react",
            "input-otp@1.4.2": "input-otp",
            "embla-carousel-react@8.6.0": "embla-carousel-react",
            "cmdk@1.1.1": "cmdk",
            "class-variance-authority@0.7.1": "class-variance-authority",
            "@radix-ui/react-tooltip@1.1.8": "@radix-ui/react-tooltip",
            "@radix-ui/react-toggle@1.1.2": "@radix-ui/react-toggle",
            "@radix-ui/react-toggle-group@1.1.2": "@radix-ui/react-toggle-group",
            "@radix-ui/react-tabs@1.1.3": "@radix-ui/react-tabs",
            "@radix-ui/react-switch@1.1.3": "@radix-ui/react-switch",
            "@radix-ui/react-slot@1.1.2": "@radix-ui/react-slot",
            "@radix-ui/react-slider@1.2.3": "@radix-ui/react-slider",
            "@radix-ui/react-separator@1.1.2": "@radix-ui/react-separator",
            "@radix-ui/react-select@2.1.6": "@radix-ui/react-select",
            "@radix-ui/react-scroll-area@1.2.3": "@radix-ui/react-scroll-area",
            "@radix-ui/react-radio-group@1.2.3": "@radix-ui/react-radio-group",
            "@radix-ui/react-progress@1.1.2": "@radix-ui/react-progress",
            "@radix-ui/react-popover@1.1.6": "@radix-ui/react-popover",
            "@radix-ui/react-navigation-menu@1.2.5": "@radix-ui/react-navigation-menu",
            "@radix-ui/react-menubar@1.1.6": "@radix-ui/react-menubar",
            "@radix-ui/react-label@2.1.2": "@radix-ui/react-label",
            "@radix-ui/react-hover-card@1.1.6": "@radix-ui/react-hover-card",
            "@radix-ui/react-dropdown-menu@2.1.6": "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-dialog@1.1.6": "@radix-ui/react-dialog",
            "@radix-ui/react-context-menu@2.2.6": "@radix-ui/react-context-menu",
            "@radix-ui/react-collapsible@1.1.3": "@radix-ui/react-collapsible",
            "@radix-ui/react-checkbox@1.1.4": "@radix-ui/react-checkbox",
            "@radix-ui/react-avatar@1.1.3": "@radix-ui/react-avatar",
            "@radix-ui/react-aspect-ratio@1.1.2": "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-alert-dialog@1.1.6": "@radix-ui/react-alert-dialog",
            "@radix-ui/react-accordion@1.2.3": "@radix-ui/react-accordion",
        },
    },
    build: {
        target: "ES2022",
    },
})
