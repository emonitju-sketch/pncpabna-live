import { useEffect, useRef, useState } from "react";

type LogKind = "error" | "warn" | "unhandled" | "network" | "info";

type LogEntry = {
  id: number;
  kind: LogKind;
  time: string;
  message: string;
  detail?: string;
};

const KIND_COLORS: Record<LogKind, string> = {
  error: "#ef4444",
  warn: "#f59e0b",
  unhandled: "#dc2626",
  network: "#8b5cf6",
  info: "#3b82f6",
};

function stringify(value: unknown): string {
  if (value instanceof Error) {
    return value.stack ?? `${value.name}: ${value.message}`;
  }
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

/**
 * PreviewDiagnostics — floating panel that surfaces why the preview iframe
 * may fail to render: runtime errors, unhandled rejections, console errors,
 * failed fetches, and missing assets. Mounted only outside production builds.
 */
export function PreviewDiagnostics() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const push = (entry: Omit<LogEntry, "id" | "time">) => {
      idRef.current += 1;
      setLogs((prev) => {
        const next: LogEntry = {
          ...entry,
          id: idRef.current,
          time: new Date().toLocaleTimeString(),
        };
        return [...prev, next].slice(-200);
      });
    };

    const onError = (event: ErrorEvent) => {
      push({
        kind: "error",
        message: event.message || "Uncaught error",
        detail: stringify(event.error ?? `${event.filename}:${event.lineno}:${event.colno}`),
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      push({
        kind: "unhandled",
        message: "Unhandled promise rejection",
        detail: stringify(event.reason),
      });
    };

    const origError = console.error;
    const origWarn = console.warn;
    console.error = (...args: unknown[]) => {
      push({ kind: "error", message: args.map(stringify).join(" ").slice(0, 240) });
      origError.apply(console, args as []);
    };
    console.warn = (...args: unknown[]) => {
      push({ kind: "warn", message: args.map(stringify).join(" ").slice(0, 240) });
      origWarn.apply(console, args as []);
    };

    const origFetch = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      try {
        const res = await origFetch(...args);
        if (!res.ok) {
          push({
            kind: "network",
            message: `${res.status} ${res.statusText} — ${typeof args[0] === "string" ? args[0] : (args[0] as Request).url}`,
          });
        }
        return res;
      } catch (err) {
        push({
          kind: "network",
          message: `Network failure — ${typeof args[0] === "string" ? args[0] : (args[0] as Request).url}`,
          detail: stringify(err),
        });
        throw err;
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    push({ kind: "info", message: "Diagnostics panel ready. Capturing errors, warnings, and network failures." });

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      console.error = origError;
      console.warn = origWarn;
      window.fetch = origFetch;
    };
  }, []);

  const errorCount = logs.filter((l) => l.kind === "error" || l.kind === "unhandled").length;

  return (
    <div style={{ position: "fixed", bottom: 12, right: 12, zIndex: 2147483647, fontFamily: "system-ui, sans-serif" }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            background: errorCount > 0 ? "#dc2626" : "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            padding: "8px 14px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          }}
          aria-label="Open preview diagnostics"
        >
          🛠 Diagnostics{errorCount > 0 ? ` (${errorCount})` : ""}
        </button>
      )}
      {open && (
        <div
          style={{
            width: "min(520px, 90vw)",
            height: "min(420px, 70vh)",
            background: "#0b1020",
            color: "#e5e7eb",
            borderRadius: 10,
            boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            border: "1px solid #1f2937",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "#111827",
              borderBottom: "1px solid #1f2937",
            }}
          >
            <strong style={{ fontSize: 13 }}>Preview Diagnostics</strong>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setLogs([])}
                style={{ background: "transparent", color: "#9ca3af", border: "1px solid #374151", borderRadius: 6, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "transparent", color: "#9ca3af", border: "1px solid #374151", borderRadius: 6, padding: "2px 8px", fontSize: 11, cursor: "pointer" }}
                aria-label="Close diagnostics"
              >
                ✕
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: 8, fontSize: 12, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
            {logs.length === 0 ? (
              <div style={{ color: "#6b7280", textAlign: "center", marginTop: 24 }}>No events captured yet.</div>
            ) : (
              logs.map((l) => (
                <details key={l.id} style={{ marginBottom: 6, borderLeft: `3px solid ${KIND_COLORS[l.kind]}`, padding: "4px 8px", background: "#0f172a", borderRadius: 4 }}>
                  <summary style={{ cursor: l.detail ? "pointer" : "default", listStyle: l.detail ? undefined : "none" }}>
                    <span style={{ color: KIND_COLORS[l.kind], fontWeight: 600, marginRight: 6 }}>[{l.kind}]</span>
                    <span style={{ color: "#9ca3af", marginRight: 6 }}>{l.time}</span>
                    <span style={{ wordBreak: "break-word" }}>{l.message}</span>
                  </summary>
                  {l.detail && (
                    <pre style={{ marginTop: 6, whiteSpace: "pre-wrap", wordBreak: "break-word", color: "#cbd5e1", fontSize: 11 }}>
                      {l.detail}
                    </pre>
                  )}
                </details>
              ))
            )}
          </div>
          <div style={{ padding: "6px 10px", borderTop: "1px solid #1f2937", color: "#6b7280", fontSize: 10 }}>
            Captures runtime errors, unhandled rejections, console.error/warn, and failed fetches.
          </div>
        </div>
      )}
    </div>
  );
}
