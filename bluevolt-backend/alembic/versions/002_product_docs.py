"""add document URL columns to products

Revision ID: 002_product_docs
Revises: 001_init
Create Date: 2026-05-24
"""
from alembic import op
import sqlalchemy as sa

revision = "002_product_docs"
down_revision = "001_init"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("products", sa.Column("spec_sheet_url", sa.String(500), nullable=False, server_default=""))
    op.add_column("products", sa.Column("safety_sheet_url", sa.String(500), nullable=False, server_default=""))
    op.add_column("products", sa.Column("usage_url", sa.String(500), nullable=False, server_default=""))
    op.add_column("products", sa.Column("coa_url", sa.String(500), nullable=False, server_default=""))


def downgrade() -> None:
    op.drop_column("products", "coa_url")
    op.drop_column("products", "usage_url")
    op.drop_column("products", "safety_sheet_url")
    op.drop_column("products", "spec_sheet_url")
