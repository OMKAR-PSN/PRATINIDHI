"""
models.py — SQLite + SQLAlchemy Database Models
भारत Avatar Platform — India Innovates 2026
"""

import os
import datetime
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./bharat_avatar.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class AvatarSession(Base):
    """Tracks video generation sessions."""
    __tablename__ = "avatar_sessions"

    id = Column(String, primary_key=True, index=True)
    avatar_id = Column(String, nullable=False, index=True)
    text_input = Column(Text, nullable=False)
    language = Column(String(10), nullable=False)
    video_path = Column(String, nullable=True)
    content_hash = Column(String(64), nullable=True)
    status = Column(String(20), nullable=False, default="pending")  # pending, processing, done, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class QASession(Base):
    """Tracks Q&A interactions with avatars."""
    __tablename__ = "qa_sessions"

    id = Column(String, primary_key=True, index=True)
    avatar_id = Column(String, nullable=False, index=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)
    language = Column(String(10), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class ConsentLog(Base):
    """Tracks OTP consent verification."""
    __tablename__ = "consent_logs"

    id = Column(String, primary_key=True, index=True)
    phone = Column(String(15), nullable=False)
    otp = Column(String(6), nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class BroadcastMessage(Base):
    """Tracks admin broadcast video messages."""
    __tablename__ = "broadcast_messages"

    id = Column(String, primary_key=True, index=True)
    avatar_id = Column(String, nullable=False, index=True)
    message = Column(Text, nullable=False)
    video_path = Column(String, nullable=True)
    status = Column(String(20), nullable=False, default="pending")  # pending, processing, done, failed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


# ==================== PRATINIDHI MODELS ====================

class Leader(Base):
    """Tracks registered leaders/users."""
    __tablename__ = "leaders"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    phone = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    security_pin_hash = Column(String, nullable=True)
    role = Column(String, nullable=False, default="leader")
    face_image_url = Column(String, nullable=True)
    face_encoding = Column(String, nullable=True)
    face_registered_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class LeaderReceiver(Base):
    """Tracks contacts/citizens added by leaders."""
    __tablename__ = "leader_receivers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    leader_id = Column(String, nullable=False, index=True)
    receiver_name = Column(String, nullable=False)
    receiver_phone = Column(String, nullable=True)
    receiver_email = Column(String, nullable=True)
    receiver_type = Column(String, default="citizen")
    language = Column(String, default="hindi")
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    has_whatsapp = Column(Boolean, default=False)
    is_app_user = Column(Boolean, default=False)
    app_user_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class Message(Base):
    """Tracks broadcast campaigns sent by leaders."""
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_id = Column(String, nullable=False, index=True)
    message_text = Column(Text, nullable=False)
    original_language = Column(String, nullable=False)
    total_receivers = Column(Integer, default=0)
    sent_count = Column(Integer, default=0)
    failed_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class InboxMessage(Base):
    """Tracks messages received by app users in their inbox."""
    __tablename__ = "inbox_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recipient_leader_id = Column(String, nullable=False, index=True)
    sender_leader_id = Column(String, nullable=False)
    message_id = Column(Integer, nullable=False)
    message_text = Column(Text, nullable=False)
    original_text = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read_at = Column(DateTime, nullable=True)


class MessageRecipient(Base):
    """Tracks delivery status of a broadcast to individual receivers."""
    __tablename__ = "message_recipients"

    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, nullable=False, index=True)
    receiver_id = Column(Integer, nullable=False)
    translated_text = Column(Text, nullable=False)
    email_status = Column(String, default="pending")
    whatsapp_status = Column(String, default="pending")
    sms_status = Column(String, default="pending")
    error_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


def init_db():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency for FastAPI — yields a DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
