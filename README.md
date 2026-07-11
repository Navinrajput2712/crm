# GrowEasy — AI-Powered CSV-to-CRM Lead Importer

GrowEasy is a web application that takes any CSV file of leads, sends it through an AI mapping layer, and stores the structured results in MongoDB. Users upload a CSV with arbitrary columns — the AI normalizes them into a fixed 15-field CRM schema, handling ambiguous column names, duplicate contact fields, and enum mapping automatically.

## Architecture

- **Frontend:** Next.js 16 (React 19), TypeScript, Tailwind CSS
- **Backend:** Express.js, TypeScript, Mongoose (MongoDB Atlas)
- **AI Provider:** Pluggable — supports OpenAI, Anthropic, Gemini, Grok, and NVIDIA (default: `openai/gpt-oss-20b`)
- **Auth:** JWT (bcrypt password hashing, no session)

## Setup

### Prerequisites

- Node.js ≥ 18
- A MongoDB Atlas cluster (or local MongoDB)
- An AI provider API key (NVIDIA free tier works — sign up at build.nvidia.com)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see below)
npm run dev
```

Required `.env` variables:

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string (e.g. `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/crm_db?retryWrites=true&w=majority`) |
| `JWT_SECRET` | Random string for signing tokens (auto-generated if omitted) |
| `AI_PROVIDER` | One of: `openai`, `anthropic`, `gemini`, `grok`, `nvidia` |
| `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` / `GEMINI_API_KEY` / `GROK_API_KEY` / `NVIDIA_API_KEY` | API key matching your chosen provider |
| `PORT` | Backend port (default: `4000`) |
| `FRONTEND_URL` | Frontend origin for CORS (default: `http://localhost:3000`) |

Create a user:

```bash
npm run create-user -- your@email.com yourpassword
```

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
npm run dev
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend URL (e.g. `http://localhost:4000`) |

Open `http://localhost:3000` and log in.

## API Contract

All endpoints are prefixed with `/api`.

### `POST /api/auth/register`

Register a new user.

```json
// Request
{ "email": "user@example.com", "password": "secret123" }

// Response (201)
{ "message": "User created", "user": { "id": "...", "email": "..." } }
```

### `POST /api/auth/login`

```json
// Request
{ "email": "user@example.com", "password": "secret123" }

// Response (200)
{ "token": "eyJhb...", "user": { "id": "...", "email": "..." } }
```

### `POST /api/extract`

Upload CSV data for AI mapping. Requires `Authorization: Bearer <token>` header.

```json
// Request
{
  "headers": ["NAME", "EMAIL", "PHONE", "COMPANY"],
  "rows": [
    ["John Doe", "john@example.com", "555-1234", "Acme Inc"],
    ["Jane Smith", "jane@test.com", "555-5678", "Widget Co"]
  ],
  "fileName": "leads.csv"
}

// Response (200)
{
  "imported": [
    {
      "created_at": "2026-07-11T00:00:00.000Z",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile_without_country_code": "5551234",
      "company": "Acme Inc",
      "crm_status": "GOOD_LEAD_FOLLOW_UP",
      "crm_note": "",
      "city": "",
      "state": "",
      "country": "",
      "country_code": "",
      "lead_owner": "",
      "data_source": "",
      "possession_time": "",
      "description": ""
    }
  ],
  "skipped": [
    { "row": ["...", "..."], "reason": "No contact information (email or phone) found" }
  ],
  "summary": {
    "totalRows": 2,
    "importedCount": 1,
    "skippedCount": 1
  }
}
```

### `GET /api/leads?search=&offset=0&limit=20`

Search and paginate leads. Requires auth.

```json
// Response (200)
{
  "leads": [ { "_id": "...", "name": "...", "email": "...", ... } ],
  "total": 150
}
```

### `GET /api/batches`

List all import batches (newest first). Requires auth.

```json
// Response (200)
{
  "batches": [
    {
      "_id": "...",
      "fileName": "leads.csv",
      "totalRows": 100,
      "totalImported": 96,
      "totalSkipped": 4,
      "createdAt": "2026-07-11T10:30:00.000Z"
    }
  ]
}
```

## AI Mapping Approach

The system prompt in `backend/src/services/providers/systemPrompt.ts` instructs the AI to map any CSV columns to the fixed 15-field CRM schema using semantic matching — it understands column names like "e-mail", "phonenumber", "CONTACT INFO", or "lead name" and maps them to the correct fields. The prompt explicitly defines the `crm_status` enum (`GOOD_LEAD_FOLLOW_UP`, `DID_NOT_CONNECT`, `BAD_LEAD`, `SALE_DONE`) and `data_source` enum (`leads_on_demand`, `meridian_tower`, `eden_park`, `varah_swamy`, `sarjapur_plots`, or empty), requiring the AI to choose only valid values. For rows with multiple emails or phone numbers, the AI is instructed to place the first one in the `email`/`mobile_without_country_code` field and append the rest to `crm_note`. If a row has no detectable email or phone, the AI returns a `"skip"` marker, and the backend separates it into the skipped list with the reason "No contact information (email or phone) found." Three few-shot examples in the prompt demonstrate these edge cases (multi-email rows, bad status inference, and source detection).

## Known Limitations

- **NVIDIA free-tier `openai/gpt-oss-20b` occasionally returns empty responses** under load. This is mitigated with a 3-attempt retry in `aiMapper.ts` — each batch retries up to 3 times before marking rows as failed.
- **Processing speed** on the free NVIDIA tier is 10-20 seconds per 20-row batch. A 100-row CSV takes roughly 50-100 seconds end-to-end.
- **DD/MM/YYYY-formatted dates** in source CSVs are not guaranteed to survive `new Date()` parsing. The AI is prompted to convert dates, but if it passes through a DD/MM/YYYY string, the date will be stored as a non-parseable string. A server-side fallback in `validators.ts` catches the most common cases but cannot handle all international date formats.
- **Multi-email / multi-mobile normalization** is entirely AI-dependent — the prompt instructs the AI to handle it, but there is no server-side post-processing to enforce the split.
- **No unit tests exist** beyond basic Zod schema validation.

## Project Structure

```
CRM/
├── frontend/          # Next.js 16 app
│   ├── app/           # Pages (dashboard, leads, history, login, profile)
│   ├── components/    # UI components (ImportModal, LeadsTable, etc.)
│   ├── lib/           # API client, auth, CSV parser
│   └── types/         # TypeScript types
└── backend/           # Express + TypeScript
    ├── src/
    │   ├── routes/    # auth, extract, leads
    │   ├── services/  # AI mapper, validators, providers
    │   ├── models/    # Mongoose schemas (Lead, User, ImportBatch, SkippedRecord)
    │   ├── middleware/ # auth, security (rate limiting, row limits)
    │   └── types/     # CRM types
    └── scripts/       # create-user CLI
```
