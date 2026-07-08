import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Notification extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public message!: string;
  public type!: string;
  public isRead!: boolean;
  public readAt?: Date;
  public data?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init({
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
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('info', 'warning', 'error', 'success'),
    allowNull: false,
    defaultValue: 'info'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  readAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  tableName: 'Notifications',
  timestamps: true,
  indexes: [
    { fields: ['userId', 'isRead'] },
    { fields: ['createdAt'] }
  ]
});

export default Notification;