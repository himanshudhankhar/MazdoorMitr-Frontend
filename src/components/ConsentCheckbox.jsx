import React, { useEffect, useMemo, useState } from "react";

/**
 * ConsentCheckbox (Plain React JS)
 * --------------------------------
 * A drop-in checkbox with policy links + optional modal + localStorage persistence.
 *
 * ✔ Plain JavaScript (no TypeScript)
 * ✔ Works with React 17/18
 * ✔ No external UI libs required
 *
 * Usage:
 *  import ConsentCheckbox from "./ConsentCheckbox";
 *  <ConsentCheckbox
 *    documents={[
 *      { title: "Terms & Conditions", href: "/terms" },
 *      { title: "Privacy Policy", href: "/privacy" },
 *      { title: "Wallet & Credits Policy", href: "/wallet-policy" },
 *    ]}
 *    policyVersion="2025-09-16"
 *    onConsentChange={(s) => console.log(s)}
 *  />
 */

const defaultDocs = [
  { title: "Terms & Conditions", href: "/terms" },
  { title: "Privacy Policy", href: "/privacy" },
];

function getStoredConsent(key = "consent.mitr", policyVersion) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (policyVersion && parsed.policyVersion !== policyVersion) return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

export function clearStoredConsent(key = "consent.mitr") {
  try {
    localStorage.removeItem(key);
  } catch {}
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[80vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold">{title || "Policies"}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full px-3 py-1 text-sm hover:bg-black/5"
          >
            ✕
          </button>
        </div>
        <div className="space-y-3 text-sm leading-6">{children}</div>
      </div>
    </div>
  );
}

function LinkList({ docs }) {
  return (
    <ul className="m-0 list-disc space-y-1 pl-5">
      {docs.map((d) => (
        <li key={d.href}>
          <a className="underline hover:no-underline" href={d.href} target="_blank" rel="noreferrer">
            {d.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

function ConsentCheckbox({
  className,
  label = "I agree to the Terms, Privacy Policy, and Wallet/Credits rules.",
  required = true,
  documents = defaultDocs,
  policyVersion,
  checked,
  onChange,
  onConsentChange,
  errorText,
  storageKey = "consent.mitr",
  compact,
}) {
  // Generate a stable id without React.useId (works on React 17 too)
  const autoId = useMemo(() => Math.random().toString(36).slice(2), []);
  const id = `consent-${autoId}`;

  const [internalChecked, setInternalChecked] = useState(() => {
    const saved = getStoredConsent(storageKey, policyVersion);
    return saved?.checked ?? false;
  });
  const isControlled = typeof checked === "boolean";
  const isChecked = isControlled ? !!checked : internalChecked;

  const [modalOpen, setModalOpen] = useState(false);

  // Persist when toggled
  useEffect(() => {
    try {
      const state = {
        checked: isChecked,
        policyVersion,
        timestamp: isChecked ? new Date().toISOString() : undefined,
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
      if (typeof onConsentChange === "function") onConsentChange(state);
    } catch {}
  }, [isChecked, policyVersion, storageKey, onConsentChange]);

  const docs = (documents && documents.length ? documents : defaultDocs);

  const handleToggle = () => {
    if (isControlled) {
      if (typeof onChange === "function") onChange(!checked);
    } else {
      setInternalChecked((v) => !v);
    }
  };

  const fieldBase =
    "flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3 hover:border-gray-300";
  const checkboxBase =
    "mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border border-gray-300 align-top";
  const labelBase = "cursor-pointer select-none text-sm leading-6";

  return (
    <div className={className}>
      <div className={compact ? `${fieldBase} p-2` : fieldBase}>
        <input
          id={id}
          type="checkbox"
          className={checkboxBase}
          checked={isChecked}
          onChange={handleToggle}
          required={required}
        />
        <label htmlFor={id} className={labelBase}>
          {label}{" "}
          <span className="text-xs text-gray-600">
            (
            <button
              type="button"
              className="underline decoration-dotted hover:no-underline"
              onClick={() => setModalOpen(true)}
            >
              view policies
            </button>
            )
          </span>
        </label>
      </div>

      {errorText && <p className="mt-1 text-xs text-red-600">{errorText}</p>}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="MazdoorMitr Policies">
        <p>
          Please review and accept these documents to proceed. They will open in a new tab if you click them.
        </p>
        <LinkList docs={docs} />
        {policyVersion && (
          <p className="mt-3 text-xs text-gray-500">
            Policy version: <span className="font-mono">{policyVersion}</span>
          </p>
        )}
      </Modal>
    </div>
  );
}

export default ConsentCheckbox;
