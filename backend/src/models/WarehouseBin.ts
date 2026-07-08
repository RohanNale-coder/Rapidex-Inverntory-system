import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class WarehouseBin extends Model {
  public id!: number;
  public rackId!: number;
  public name!: string;
  public code!: string;
  public capacity?: number;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

WarehouseBin.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  rackId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'WarehouseRacks', key: 'id' }
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
  tableName: 'WarehouseBins',
  timestamps: true
});

export default WarehouseBin;