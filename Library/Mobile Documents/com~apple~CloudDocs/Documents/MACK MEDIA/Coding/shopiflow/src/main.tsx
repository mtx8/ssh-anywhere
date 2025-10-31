import "framer-plugin/framer.css";

import { framer } from "framer-plugin";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { isFramerRuntime } from "./lib/settings";

function DevFallback() {
    return (
        <main
            style={{
                fontFamily: "Inter, system-ui, sans-serif",
                padding: "1.5rem",
                display: "grid",
                gap: "0.75rem",
                maxWidth: "480px",
                margin: "4rem auto",
            }}
        >
            <h1 style={{ fontSize: "1.25rem", margin: 0 }}>Shopiflow Plugin</h1>
            <p style={{ margin: 0 }}>
                This page is intended to run inside Framer Desktop. Use <code>npm run dev</code> and choose{" "}
                <strong>Plugins → Open Development Plugin…</strong> to launch the live plugin UI.
            </p>
            <p style={{ margin: 0 }}>
                You can still browse the interface below for quick inspections, but Shopify API calls will require the
                Framer environment (or the proxy endpoint provided by the dev server).
            </p>
        </main>
    );
}

const runtime = isFramerRuntime();

if (runtime) {
    void framer
        .showUI({ position: "center", width: 480, height: 720 })
        .catch(() => {
            // ignored outside Framer or when already visible
        });
    const envError = document.getElementById("framer-environment-error");
    if (envError) {
        envError.style.display = "none";
    }
}

const content = runtime ? (
    <App />
) : (
    <>
        <DevFallback />
        <div style={{ padding: "0 1.5rem 3rem" }}>
            <App />
        </div>
    </>
);

const root = document.getElementById("root");
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            {content}
        </React.StrictMode>,
    );
}
