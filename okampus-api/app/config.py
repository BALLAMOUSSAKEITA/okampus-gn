from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str = "HS256"
    accèss_token_expire_minutes: int = 60 * 24 * 90  # 90 jours — session jusqu'a deconnexion
    vapid_public_key: str = ""
    vapid_private_key: str = ""
    vapid_subject: str = "mailto:support@bachelio.gn"
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    assistant_chat_daily_limit: int = 15
    assistant_orientation_monthly_limit: int = 5

    model_config = {"env_file": ".env"}


settings = Settings()
