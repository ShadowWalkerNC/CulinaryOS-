import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileText } from 'lucide-react';

const BUILD_PLAN_MARKDOWN = `
# CulinaryOS
## The Definitive Build Plan

v5.0 Final · 2025 · Bangor, Maine

**★ FOUNDING CUSTOMER LIFETIME GUARANTEE ★**
Customers #1 – #5 receive lifetime access to every feature, every update, forever. No additional charge. Ever.
Documented. Public. Irrevocable. Transferable with business sale.

One Platform. One Price. Every Feature. Forever.
v5.0 Final · 2025 · CONFIDENTIAL

## Part I — Mission, Vision & Purpose

**THE MISSION**
"The software must never be the reason service fails."
CulinaryOS exists so that operators focus on food, guests, and craft — not on software.

### 1.1 What CulinaryOS Is
CulinaryOS is a food service operating system. Not a point-of-sale app with extra features.
Not a collection of loosely connected tools. The entire operating layer for a restaurant — dining room, kitchen, inventory, office, and every customer relationship — in one system, on any hardware the operator already owns, working completely without internet for up to 48 hours.

The founding truth is simple: a crashed POS during Saturday dinner service is not a software problem — it is a business emergency.
CulinaryOS solves this by treating offline as the primary mode and internet as a convenience.
The system writes to the local device first, syncs in the background, and never makes the user wait for a network response.
CulinaryOS is the operating system for food service that works the way restaurants actually work — under pressure, without reliable internet, with staff of varying technical ability, in fast-moving, high-stakes environments.

### 1.2 The Vision
Every independent food service operator in America deserves access to enterprise-grade operational software at a price that makes sense for their margins.
CulinaryOS delivers that: the full feature set of a $300/month enterprise POS at $79/month, on hardware the operator already owns, with AI built in, and a pricing model that never surprises them.
The long-term vision: a network where operators, staff, vendors, and customers are connected through a single platform — not through six different apps that do not talk to each other.
Every module added to CulinaryOS makes the whole network more valuable. This is built one proven layer at a time.

### 1.3 Core Principles — Non-Negotiable

| Principle | What It Means in Practice |
| :--- | :--- |
| Offline First | Every operation writes to the local device first. The network is never in the critical path of taking an order or processing a payment. |
| One Price. Everything. | No add-ons. No feature gates. Every tier includes every feature. Tiers differ only in the number of locations and terminals supported. |
| Security Is Structure | "Allergen acknowledgment and age verification are security controls — not UX. They cannot be disabled, bypassed, or overridden at any level. Period." |
| Audit Everything | "Every state-changing operation writes to an append-only audit log. INSERT only — no UPDATE, no DELETE, even for the database owner. Seven-year retention for payments." |
| "AI Is a Tool, Not a Crutch" | No AI output is ever applied automatically without operator review. AI assists decision-making — it does not make decisions. The operator always has the final word. |
| "Extensions, Not Bloat" | "Advanced and specialized features — including AI tools — are built as extensions. The core platform stays lean, fast, and reliable. Extensions add depth without adding fragility." |
| Earn Each Layer | No module is built before the previous module has paying customers validating it. Revenue gates protect against building the wrong thing at the wrong time. |

### 1.4 Why Bangor, Maine — and Why Now
Bangor is the commercial hub of Eastern and Northern Maine — 32,000 city, 150,000 metro.
Large enough to validate the product, small enough that the founder can personally know every operator.
Most Bangor operators are on Square, Toast, or paper. None of those systems work offline. CulinaryOS does.
That is the entire sales pitch.

The timing is precise: Square and Toast are becoming more expensive and more complex.
Operators are being pushed toward hardware lock-in they cannot afford and cloud dependencies they cannot trust.
CulinaryOS enters the market at the exact moment operators are asking "is there a better option?"
The answer is yes, and it is local.

## Part II — System Architecture

### 2.1 Four-Layer Architecture Diagram
CulinaryOS is built on four independent layers.
Each layer can function even if the layer above it is unavailable. This is what guarantees 48-hour offline resilience.

| LAYER 4 — AI SERVICES (Cloud-Dependent Features) | Anthropic claude-sonnet-4-6 · Custom Prompt Library · Extension AI Tools Marketplace |
| :--- | :--- |
| ↑ when internet available ↓ gracefully degrades offline | |
| **LAYER 3 — CLOUD LAYER (Supabase)** | PostgreSQL + RLS · Supabase Auth · Realtime · Storage · Edge Functions · PowerSync Sync Engine |
| ↑ bidirectional sync via PowerSync ↓ | |
| **LAYER 2 — SYNC LAYER (PowerSync + WebRTC)** | Mutation Queue · Conflict Resolution (Last-Write-Wins + G-Counter CRDT) · WebRTC P2P for POS↔KDS · Store Server Relay |
| ↑ device-to-device on local network ↓ | |
| **LAYER 1 — DEVICE LAYER (Flutter + Drift) — ALWAYS AVAILABLE** | Flutter 3.41+ · Drift SQLite + SQLCipher · Riverpod State · GoRouter · Stripe Terminal SDK · Tesseract OCR · Rule-Based Intelligence |

Layer 1 functions completely alone. Layer 2 adds real-time multi-device communication. Layer 3 adds cloud sync, backups, and push notifications.
Layer 4 adds AI capabilities. Removing layers 2–4 still leaves a fully functional POS.
`;

export function BuildPlanView() {
  return (
    <div className="p-8 h-full overflow-y-auto bg-bg-deep text-text-primary">
      <div className="flex items-center mb-6">
        <FileText className="mr-3 text-accent" size={32} />
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-serif text-text-primary">The Definitive Build Plan</h1>
          <p className="text-text-secondary mt-1">CulinaryOS v5.0 Final</p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl bg-bg-surface p-8 rounded-xl shadow-sm border border-border-subtle overflow-hidden relative">
        <div className="markdown-body text-text-primary 
           [&_h1]:font-serif [&_h1]:text-3xl [&_h1]:mb-6 [&_h1]:pb-2 [&_h1]:border-b [&_h1]:border-border-subtle
           [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:mt-8 [&_h2]:mb-4
           [&_h3]:font-serif [&_h3]:text-xl [&_h3]:mt-6 [&_h3]:mb-3
           [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-text-secondary
           [&_strong]:text-text-primary [&_strong]:font-semibold
           [&_table]:w-full [&_table]:mb-6 [&_table]:border-collapse
           [&_th]:text-left [&_th]:p-3 [&_th]:border-b [&_th]:border-border-subtle [&_th]:font-semibold [&_th]:text-text-primary
           [&_td]:p-3 [&_td]:border-b [&_td]:border-border-subtle [&_td]:text-text-secondary
           [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:text-text-secondary
           [&_li]:mb-1
        ">
          <ReactMarkdown>{BUILD_PLAN_MARKDOWN}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
