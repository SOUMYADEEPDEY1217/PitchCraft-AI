"""Initial database schema for PitchCraft AI.

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-13 00:00:00.000000

Supports SQLite and PostgreSQL.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create clients table
    op.create_table(
        'clients',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('company', sa.String(length=255), nullable=False),
        sa.Column('industry', sa.String(length=128), nullable=False, server_default='Technology'),
        sa.Column('phone', sa.String(length=64), nullable=True),
        sa.Column('website', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='lead'),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_clients_id', 'clients', ['id'])
    op.create_index('ix_clients_email', 'clients', ['email'])
    op.create_index('ix_clients_company', 'clients', ['company'])
    op.create_index('ix_clients_status', 'clients', ['status'])

    # 2. Create proposals table
    op.create_table(
        'proposals',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('client_id', sa.String(length=36), sa.ForeignKey('clients.id', ondelete='CASCADE'), nullable=False),
        sa.Column('project_title', sa.String(length=255), nullable=False),
        sa.Column('project_brief', sa.Text(), nullable=False, server_default=''),
        sa.Column('service_category', sa.String(length=64), nullable=False, server_default='web_development'),
        sa.Column('tone', sa.String(length=32), nullable=False, server_default='consultative'),
        sa.Column('currency', sa.String(length=16), nullable=False, server_default='USD'),
        sa.Column('content_json', sa.JSON(), nullable=False),
        sa.Column('pricing_json', sa.JSON(), nullable=False),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='draft'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_proposals_id', 'proposals', ['id'])
    op.create_index('ix_proposals_client_id', 'proposals', ['client_id'])
    op.create_index('ix_proposals_project_title', 'proposals', ['project_title'])
    op.create_index('ix_proposals_service_category', 'proposals', ['service_category'])
    op.create_index('ix_proposals_status', 'proposals', ['status'])

    # 3. Create ai_generation_history table
    op.create_table(
        'ai_generation_history',
        sa.Column('id', sa.String(length=36), primary_key=True, nullable=False),
        sa.Column('proposal_id', sa.String(length=36), sa.ForeignKey('proposals.id', ondelete='SET NULL'), nullable=True),
        sa.Column('model_name', sa.String(length=64), nullable=False),
        sa.Column('generation_type', sa.String(length=64), nullable=False),
        sa.Column('duration_ms', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('status', sa.String(length=32), nullable=False, server_default='success'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_ai_generation_history_id', 'ai_generation_history', ['id'])
    op.create_index('ix_ai_generation_history_proposal_id', 'ai_generation_history', ['proposal_id'])
    op.create_index('ix_ai_generation_history_generation_type', 'ai_generation_history', ['generation_type'])
    op.create_index('ix_ai_generation_history_created_at', 'ai_generation_history', ['created_at'])


def downgrade() -> None:
    op.drop_table('ai_generation_history')
    op.drop_table('proposals')
    op.drop_table('clients')
