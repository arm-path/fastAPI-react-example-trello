from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    BACKEND_BASE_URL: str
    FRONTEND_BASE_URL: str

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_ECHO: bool
    AUTH_SECRET_JWT: str
    AUTH_LIFETIME_SECONDS_JWT: int
    SECRET_EMAIL_CONFIRMATION: str
    SECRET_USER_MANAGER: str

    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str

    DATABASE_CONVENTION: dict[str, str] = {
        'ix': 'ix_%(column_0_label)s',
        'uq': 'uq_%(table_name)s_%(column_0_N_name)s',
        'ck': 'ck_%(table_name)s_%(constraint_name)s',
        'fk': 'fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s',
        'pk': 'pk_%(table_name)s',
    }

    ALLOWED_MIME_TYPES: list[str] = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/x-msvideo',
        'application/pdf'
    ]

    @property
    def database_url(self):
        return f'postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'

    model_config = SettingsConfigDict(env_file='.env')


settings = Settings()
