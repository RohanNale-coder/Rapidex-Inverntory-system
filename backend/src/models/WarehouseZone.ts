import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class WarehouseZone extends Model {
  public id!: number;
  public warehouseId!: number;
  public name!: string;
  public code!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WarehouseZone.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Warehouses', key: 'id' }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'WarehouseZones',
  timestamps: true
});

export default WarehouseZone;