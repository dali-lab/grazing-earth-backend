'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cow_census', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      herdId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'herds',
          key: 'id',
        },
      },
      photoId: { // TODO: BCS
        type: Sequelize.UUID,
        allowNull: false,
      },
      bcs: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      notes: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tag: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cow_census');
  },
};
