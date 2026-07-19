'use strict';

const TABLE_NAME = 'leads';
const OLD_COLUMN = 'status';
const NEW_COLUMN = 'lead_status';

module.exports = {
  async up(knex) {
    if (!(await knex.schema.hasTable(TABLE_NAME))) {
      return;
    }

    const hasOldColumn = await knex.schema.hasColumn(TABLE_NAME, OLD_COLUMN);
    const hasNewColumn = await knex.schema.hasColumn(TABLE_NAME, NEW_COLUMN);

    if (!hasNewColumn) {
      await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string(NEW_COLUMN, 255);
      });
    }

    if (hasOldColumn) {
      await knex(TABLE_NAME)
        .whereNull(NEW_COLUMN)
        .update({ [NEW_COLUMN]: knex.ref(OLD_COLUMN) });
    }
  },

  async down(knex) {
    if (!(await knex.schema.hasTable(TABLE_NAME))) {
      return;
    }

    const hasOldColumn = await knex.schema.hasColumn(TABLE_NAME, OLD_COLUMN);
    const hasNewColumn = await knex.schema.hasColumn(TABLE_NAME, NEW_COLUMN);

    if (!hasOldColumn) {
      await knex.schema.alterTable(TABLE_NAME, (table) => {
        table.string(OLD_COLUMN, 255);
      });
    }

    if (hasNewColumn) {
      await knex(TABLE_NAME)
        .whereNull(OLD_COLUMN)
        .update({ [OLD_COLUMN]: knex.ref(NEW_COLUMN) });
    }
  }
};
