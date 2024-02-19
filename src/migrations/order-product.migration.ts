import { DataTypes, type Sequelize } from "sequelize";
import { type MigrationFn } from "umzug";

export const up: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("order-product", {
    orderId: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });
};

export const down: MigrationFn<Sequelize> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("order-product");
};
