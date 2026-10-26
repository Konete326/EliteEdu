# Project Rules & Agent Guidelines

This document contains strict coding, architectural, and behavioral rules that any AI Agent MUST follow during development. These rules are mandatory.

---

## 1. Strict Scope Control & Feature Isolation (Jitna Kaam Bola Jaye, Sirf Utna Karna Hai)
* **Only Requested Work:** Implement strictly what the user asks for. Do not build unrequested, extra, or "bonus" features.
* **No Side-Effects / Isolated Changes:** Do not touch, edit, or modify any unrelated files, features, components, or configurations. Work strictly within the requested feature boundary.
* **No Unsolicited Refactoring:** Never refactor or rewrite existing working code unless explicitly instructed to do so.

---

## 2. Technology & Language Standards (Strict JSX Only, No TypeScript)
* **JSX / JavaScript Only:** All frontend components, hooks, and utilities must strictly use JSX (`.jsx`) and JavaScript (`.js`).
* **Zero TypeScript:** Do NOT use TypeScript (`.ts`, `.tsx`), TypeScript interfaces, types, or build configs under any circumstances.
* **Communication Language:** All responses, explanations, and messages to the user MUST be delivered in **Roman Urdu** (conversational Urdu/Hindi written in English letters).

---

## 3. Modular Architecture & File Size Limits
* **Strict Structural Organization:** Always adhere to the established MERN architecture (Frontend and Backend). Place files in their correct folders (`controllers`, `routes`, `models`, `components`, `pages`, `services`).
* **Component-wise Frontend:** Split frontend code into clean, modular, reusable React JSX components. Never write monolithic components (avoid 500+ line files).
* **Lightweight Server Files:** Backend logic must be properly broken down into dedicated files. A single server/controller file should generally not exceed 120 lines.
* **No Unnecessary Files (Keep Project Lightweight):** Do not generate redundant helper files, duplicate templates, or bloated libraries. Do not add heavy dependencies or bloat to the workspace.

---

## 4. Code Quality & Functional Standards
* **Fully Functional Implementations (No Dummy Code):** Every feature must be completely functional with real logic, proper API calls, and error handling. No dummy data, placeholder functions, or fake UI stubs.
* **Zero Comments:** Absolutely **no comments** in the generated code. The code must be self-documenting, clean, and modern.
* **Security & Stability:** Validate inputs, use secure authentication/authorization, and handle edge cases gracefully to prevent production crashes.

---

## 5. UI, UX & Interaction Standards
* **Professional Icons & UI Aesthetics:** Use clean, professional icons (e.g., `lucide-react`) and modern Tailwind CSS styling. Avoid amateur or generic AI aesthetic patterns.
* **No Native Browser Dialogs:** Never use browser `alert()`, `confirm()`, or `prompt()`. Always use custom, theme-aware accessible modals or toast alerts.

---

## 6. End of Task Reporting
* **Roman Urdu Summary:** Report all completed work clearly and concisely in Roman Urdu.
* **Proactive Observations:** If any potential flaw, conflict, or performance bottleneck is observed in the requested feature, report it with recommended fixes.

---

## 7. Execution & Testing Boundaries (No Browser Preview)
* **No Auto Browser Preview / Dev Servers:** Agent khud se koi browser preview, dev server, ya browser inspection launch nahi karega. Browser preview aur live testing user khud manually karega.
* **Flawless Implementation:** Jo bhi feature ya kaam diya jaye, usay proper structure, bina kisi error, aur pure standard ke mutabiq complete karna hai.
