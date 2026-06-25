from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "my project name"
    PORT: int = 400
    clientId: str
    MONGO_URL: str
    GEMINI_API_KEY: str
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="allow"
    )
    clientSecret: str
    API_KEY: str


settings = Settings()
