
exports.up = function(knex, Promise) {
  return knex.schema.createTable('forex_levels', function(table) {
    table.increments('id').primary();
    table.string('forex_name').notNullable();
    table.string('upper');
    table.string('lower');
    table.boolean('status').defaultTo('active');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('forex_levels')
}
