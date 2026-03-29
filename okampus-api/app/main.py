from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, calendar, cv, entrepreneur, parcours, resources, scholarships, stages, success_stories, users

app = FastAPI(title="O'Kampus API", version="1.0.0")

# CORS — autorise le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://okampus-gn-production.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(calendar.router)
app.include_router(cv.router)
app.include_router(entrepreneur.router)
app.include_router(parcours.router)
app.include_router(resources.router)
app.include_router(scholarships.router)
app.include_router(stages.router)
app.include_router(success_stories.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
