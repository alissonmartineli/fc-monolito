import { DataTypes, type Sequelize } from "sequelize";
import { type MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("invoice-items", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "invoices",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("invoice-items");
};
