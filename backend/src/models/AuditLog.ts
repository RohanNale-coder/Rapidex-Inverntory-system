import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class AuditLog extends Model {
  public id!: number;
  public userId!: number;
  public action!: string;
  public entityType!: string;
  public entityId?: number;
  public oldValues?: string;
  public newValues?: string;
  public ipAddress?: string;
  public userAgent?: string;
  public readonly createdAt!: Date;
}

AuditLog.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  action: {
    type: DataTypes.ENUM('create', 'read', 'update', 'delete', 'login', 'logout'),
    allowNull: false
  },
  entityType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  oldValues: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  newValues: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true
  },
  userAgent: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'AuditLogs',
  timestamps: true,
  createdAt: true,
  updatedAt: false,
  indexes: [
    { fields: ['userId'] },
    { fields: ['entityType', 'entityId'] },
    { fields: ['createdAt'] }
  ]
});

export default AuditLog;