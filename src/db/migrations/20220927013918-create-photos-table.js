'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('photos', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      fullUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    // Disconnect the foreign keys
    await queryInterface.dropTable('photos');
  },
};

