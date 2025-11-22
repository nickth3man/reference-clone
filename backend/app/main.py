from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.logging_config import configure_logging, get_logger
from app.routers import games, players, teams

# Configure structured logging
configure_logging("INFO")
logger = get_logger(__name__)

app = FastAPI(title="Basketball Reference Clone API")

logger.info("Application started", extra={"app_name": "Basketball Reference Clone API"})

# CORS Setup
origins = [
    "http://localhost:3000",
    "http://localhost:3002",
    "http://localhost:8000",
    "http://localhost:8001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(teams.router, tags=["Teams"])
app.include_router(players.router, tags=["Players"])
app.include_router(games.router, tags=["Games"])


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Welcome to the Basketball Reference Clone API"}


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
