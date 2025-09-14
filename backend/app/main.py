from fastapi import FastAPI, Depends
from .db import init_engine_and_session, Base
from .auth import verify_jwt_and_get_claims
from .routers import sessions as sessions_router


def create_app() -> FastAPI:
    app = FastAPI(title="MyAuthApp Backend")

    @app.on_event("startup")
    async def startup_event() -> None:
        engine, _ = init_engine_and_session()
        Base.metadata.create_all(bind=engine)

    @app.get("/health")
    async def health() -> dict:
        return {"status": "ok"}

    @app.get("/me")
    async def me(claims: dict = Depends(verify_jwt_and_get_claims)) -> dict:
        return {"sub": claims.get("sub"), "name": claims.get("name"), "email": claims.get("email")}

    app.include_router(sessions_router.router)

    return app


app = create_app()


