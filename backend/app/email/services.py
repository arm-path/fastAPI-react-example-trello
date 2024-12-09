import smtplib
from email.message import EmailMessage

from pydantic import EmailStr

from app.settings import settings


def build_message(user_email: EmailStr, subject: str, content: str, token: str):
    message = EmailMessage()
    message['Subject'] = subject
    message['From'] = settings.SMTP_USER
    message['To'] = settings.SMTP_USER  # TODO: change user_email.
    message.set_content(content, subtype='html')

    return message


def send_massage(user_email, subject: str, content: str, token: str):
    email = build_message(user_email, subject, content, token)
    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
        server.send_message(email)


def send_email_user_verified(user_email, token):
    subject = 'Activation'
    link_activate = f'{settings.BACKEND_BASE_URL}auth/activate/{token}'
    content = f"Follow the link to activate your account: <a href='{link_activate}'>Go to</a>"
    send_massage(user_email, subject, content, token)

def send_email_forgot_password(user_email, token):
    subject = 'Forgot password'
    link_activate = f'{settings.FRONTEND_BASE_URL}change-password/{token}'
    content = f"Follow the link to change the password recovery and change: <a href='{link_activate}'>Go to</a>"
    send_massage(user_email, subject, content, token)
