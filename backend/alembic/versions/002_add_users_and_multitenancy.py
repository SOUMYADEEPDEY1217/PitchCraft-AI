"""Add users, user_sessions, password_reset_tokens, saved_pricing, preferences, and multitenant user_id isolation.

Revision ID: 002_add_users_and_multitenancy
Revises: 001_initial_schema
Create Date: 2026-10-14 00:00:00.000000

Supports SQLite and PostgreSQL.
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '002_add_users_and_multitenancy'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        'users',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # 2. Create user_sessions table
    op.create_table(
        'user_sessions',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('session_token', sa.String(length=128), nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('user_agent', sa.String(length=255), nullable=True),
        sa.Column('ip_address', sa.String(length=64), nullable=True),
    )
    op.create_index('ix_user_sessions_id', 'user_sessions', ['id'])
    op.create_index('ix_user_sessions_session_token', 'user_sessions', ['session_token'], unique=True)
    op.create_index('ix_user_sessions_user_id', 'user_sessions', ['user_id'])
    op.create_index('ix_user_sessions_expires_at', 'user_sessions', ['expires_at'])

    # 3. Create password_reset_tokens table
    op.create_table(
        'password_reset_tokens',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('token_hash', sa.String(length=128), nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_password_reset_tokens_id', 'password_reset_tokens', ['id'])
    op.create_index('ix_password_reset_tokens_token_hash', 'password_reset_tokens', ['token_hash'], unique=True)
    op.create_index('ix_password_reset_tokens_user_id', 'password_reset_tokens', ['user_id'])

    # 4. Create saved_pricing_estimates table
    op.create_table(
        'saved_pricing_estimates',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('client_name', sa.String(length=255), nullable=True),
        sa.Column('calculation_json', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_saved_pricing_estimates_id', 'saved_pricing_estimates', ['id'])
    op.create_index('ix_saved_pricing_estimates_user_id', 'saved_pricing_estimates', ['user_id'])

    # 5. Create user_preferences table
    op.create_table(
        'user_preferences',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('user_id', sa.String(length=36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('settings_json', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_user_preferences_id', 'user_preferences', ['id'])
    op.create_index('ix_user_preferences_user_id', 'user_preferences', ['user_id'], unique=True)

    # 6. Add user_id column to existing tables with batch_alter_table for SQLite compatibility
    with op.batch_alter_table('clients') as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.String(length=36), nullable=True))
        batch_op.create_index('ix_clients_user_id', ['user_id'])
        batch_op.create_foreign_key('fk_clients_user_id', 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('proposals') as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.String(length=36), nullable=True))
        batch_op.create_index('ix_proposals_user_id', ['user_id'])
        batch_op.create_foreign_key('fk_proposals_user_id', 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('ai_generation_history') as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.String(length=36), nullable=True))
        batch_op.create_index('ix_ai_generation_history_user_id', ['user_id'])
        batch_op.create_foreign_key('fk_ai_generation_history_user_id', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    with op.batch_alter_table('ai_generation_history') as batch_op:
        batch_op.drop_index('ix_ai_generation_history_user_id')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('proposals') as batch_op:
        batch_op.drop_index('ix_proposals_user_id')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('clients') as batch_op:
        batch_op.drop_index('ix_clients_user_id')
        batch_op.drop_column('user_id')

    op.drop_table('user_preferences')
    op.drop_table('saved_pricing_estimates')
    op.drop_table('password_reset_tokens')
    op.drop_table('user_sessions')
    op.drop_table('users')
