from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from strawberry.fastapi import GraphQLRouter

from app.graphql_schema import schema
from app.logging_config import configure_logging, get_logger
from app.rate_limit import limiter
from app.routers import boxscores, games, players, seasons, teams

# Configure structured logging
configure_logging("INFO")
logger = get_logger(__name__)

app = FastAPI(title="Basketball Reference Clone API")

# Add rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


# Rate limit exception handler
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> dict[str, str]:
    logger.warning(
        "Rate limit exceeded",
        extra={"ip": request.client.host if request.client else "unknown"},
    )
    return {"error": "Rate limit exceeded. Please try again later."}


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
app.include_router(seasons.router, tags=["Seasons"])
app.include_router(boxscores.router, tags=["Box Scores"])

# Add GraphQL endpoint
graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")


@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "message": "Welcome to the Basketball Reference Clone API",
        "graphql": "/graphql",
        "docs": "/docs",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "healthy"}
