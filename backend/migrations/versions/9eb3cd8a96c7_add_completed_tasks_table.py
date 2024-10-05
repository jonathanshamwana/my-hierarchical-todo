"""Add completed tasks table

Revision ID: 9eb3cd8a96c7
Revises: 
Create Date: 2024-10-04 16:18:54.620158

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9eb3cd8a96c7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('completed_task',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('subtasks', sa.Text(), nullable=True),
    sa.Column('completion_date', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('completed_task')
    # ### end Alembic commands ###
