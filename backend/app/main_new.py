"""FastAPI application entry point.

This module initializes the FastAPI application with all routes,
middleware, and exception handlers.

The application supports both legacy routes (for backward compatibility)
and the new v1 API routes.
"""

from contextlib import asynccontextmanager
from collections.abc import AsyncGenerator
from typing import Any

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from strawberry.fastapi import GraphQLRouter

from app.api.graphql.schema import schema
from app.api.v1.router import router as v1_router
from app.core.config import settings
from app.core.logging import configure_logging, get_logger
from app.core.rate_limit import limiter

# Legacy imports for backward compatibility
from app.routers import boxscores, contracts, draft, franchises, games, players, seasons, teams

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan handler."""
    configure_logging(settings.LOG_LEVEL)
    logger.info("Application started", extra={"app_name": settings.APP_NAME})
    yield


app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    description="NBA statistics API - Basketball Reference Clone",
    version="1.0.0",
)

# Add rate limiting
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(
    request: Request,
    exc: RateLimitExceeded,
) -> dict[str, str]:
    """Handle rate limit exceeded errors."""
    logger.warning(
        "Rate limit exceeded",
        extra={"ip": request.client.host if request.client else "unknown"},
    )
    return {"error": "Rate limit exceeded. Please try again later."}


@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    """Handle uncaught exceptions."""
    logger.error(
        "Global exception handler caught error",
        exc_info=True,
        extra={"path": request.url.path},
    )
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error"},
    )


# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the new v1 API router
app.include_router(v1_router)

# Include legacy routers for backward compatibility
# These will be deprecated in a future version
app.include_router(teams.router, tags=["Teams (Legacy)"])
app.include_router(franchises.router, tags=["Franchises (Legacy)"])
app.include_router(players.router, tags=["Players (Legacy)"])
app.include_router(games.router, tags=["Games (Legacy)"])
app.include_router(seasons.router, tags=["Seasons (Legacy)"])
app.include_router(boxscores.router, tags=["Box Scores (Legacy)"])
app.include_router(draft.router, tags=["Draft (Legacy)"])
app.include_router(contracts.router, tags=["Contracts (Legacy)"])

# Add GraphQL endpoint
graphql_app: GraphQLRouter[Any, Any] = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")


@app.get("/")
def read_root() -> dict[str, str]:
    """Root endpoint with API information."""
    return {
        "message": "Welcome to the Basketball Reference Clone API",
        "api_v1": "/api/v1",
        "graphql": "/graphql",
        "docs": "/docs",
    }


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
