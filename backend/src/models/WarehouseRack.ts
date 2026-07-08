import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class WarehouseRack extends Model {
  public id!: number;
  public zoneId!: number;
  public name!: string;
  public code!: string;
  public capacity?: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WarehouseRack.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  zoneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'WarehouseZones', key: 'id' }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'WarehouseRacks',
  timestamps: true
});

export default WarehouseRack;