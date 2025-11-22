from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import games, players, teams

app = FastAPI(title="Basketball Reference Clone API")

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
def read_root():
    return {"message": "Welcome to the Basketball Reference Clone API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
