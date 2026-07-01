# ComplyOG — Regulatory & ESG Compliance Platform

Oil & gas regulatory and ESG compliance platform with emissions tracking, compliance monitoring, ESG scoring, and real-time compliance alerts.

## Quick Start

```bash
docker compose up -d
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## Features

- **Emissions Tracking** — Record CO₂, CH₄, N₂O emissions per facility with automatic CO₂e calculation (GWP: CH₄=28, N₂O=265)
- **Regulatory Compliance** — Track regulations across EPA, OSHA, BLM, state, and local authorities with status monitoring
- **ESG Scoring** — Automated ESG score calculation (0-100) based on emissions performance, compliance rate, and audit results
- **Compliance Audits** — Full audit lifecycle management with scope, findings, and scoring
- **Gap Analysis** — Identify compliance gaps from regulations and audit findings
- **Real-time Alerts** — WebSocket-powered compliance events (emission exceeded, deadline approaching, non-compliance, report due)
- **Compliance Agent** — Built-in analysis engine for carbon footprint, regulation status, ESG assessment, and report generation

## Architecture

```
├── backend/            FastAPI + SQLAlchemy (async) + PostgreSQL
├── frontend/           React + TypeScript + Tailwind + Zustand
├── docker-compose.yml  PostgreSQL, backend, frontend
```

## API Endpoints

| Endpoint | Description |
|---|---|
| `POST /api/v1/auth/register` | User registration |
| `POST /api/v1/auth/login` | User login |
| `GET /api/v1/emissions` | List emissions |
| `POST /api/v1/emissions` | Create emission record |
| `GET /api/v1/emissions/stats` | Emission statistics |
| `GET /api/v1/regulations` | List regulations |
| `POST /api/v1/regulations` | Add regulation |
| `GET /api/v1/regulations/stats` | Regulation statistics |
| `GET /api/v1/audits` | List audits |
| `POST /api/v1/audits` | Create audit |
| `GET /api/v1/audits/stats` | Audit statistics |
| `GET /api/v1/alerts` | List alerts |
| `WS /ws` | WebSocket compliance events |

## Compliance Agent

The `ComplianceAgent` provides:
- `calculate_carbon_footprint()` — Total CO2e breakdown by source
- `check_regulation_status()` — Compliance check against regulations
- `assess_esg_score()` — ESG score (0-100)
- `identify_compliance_gaps()` — Gap analysis
- `generate_compliance_report()` — Report generation

## Tech Stack

- **Backend:** Python 3.12, FastAPI, SQLAlchemy (async), PostgreSQL, JWT, WebSockets
- **Frontend:** React 18, TypeScript, Tailwind CSS, Zustand, Axios
- **Infrastructure:** Docker, Docker Compose
