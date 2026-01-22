"""Add 2FA columns to users table

Revision ID: 001_add_2fa_columns
Revises:
Create Date: 2025-01-22

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_add_2fa_columns'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add two_factor_enabled column
    op.add_column('users', sa.Column('two_factor_enabled', sa.Boolean(), nullable=True))
    op.execute("UPDATE users SET two_factor_enabled = false WHERE two_factor_enabled IS NULL")
    op.alter_column('users', 'two_factor_enabled', nullable=False, server_default='false')

    # Add totp_secret column
    op.add_column('users', sa.Column('totp_secret', sa.String(32), nullable=True))

    # Add totp_confirmed column
    op.add_column('users', sa.Column('totp_confirmed', sa.Boolean(), nullable=True))
    op.execute("UPDATE users SET totp_confirmed = false WHERE totp_confirmed IS NULL")
    op.alter_column('users', 'totp_confirmed', nullable=False, server_default='false')


def downgrade() -> None:
    op.drop_column('users', 'totp_confirmed')
    op.drop_column('users', 'totp_secret')
    op.drop_column('users', 'two_factor_enabled')
