"""delete project description

Revision ID: b8d4e5d479c6
Revises: 49e506464be8
Create Date: 2024-10-14 20:51:33.115462

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b8d4e5d479c6'
down_revision: Union[str, None] = '49e506464be8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('project', 'description')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('project', sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
