# Rumii AI

Self-hosted AI workspace: chat, agents, research, docs, email and calendar in one app.

**Live demo:** https://rumii-ai.vercel.app

<img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/6fce21a4-9497-478e-b79c-2763e9a63310" />


## Features
- AI chat with multiple LLM providers
- Agents and MCP server integrations (`mcp_servers/`)
- Research, document, email and calendar modules
- Auth, DB models and Alembic migrations
- Docker, Render and Hugging Face Spaces deployment

## Tech Stack
| Layer | Tech |
|---|---|
| Backend | Python, <FastAPI/Flask>, SQLAlchemy, Alembic |
| Frontend | <React/JS>, `frontend/` |
| DevOps | Docker, docker-compose, Render, HF Spaces |
| Tests | `test_security.py`, `test_latency.py` |

## Project Structure
```
app.py          # entry point
core/           # core logic
routes/         # API routes
models/         # DB models
alembic/        # migrations
mcp_servers/    # MCP integrations
frontend/       # UI
```

## Quick Start
```bash
git clone https://github.com/Manideep71234/sentiq.ai
cd sentiq.ai
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # add your API keys
alembic upgrade head
python app.py
```
Docker: `docker-compose up --build`

## License
MIT
