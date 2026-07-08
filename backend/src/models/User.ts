import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public avatar?: string;
  public roleId!: number;
  public companyId!: number;
  public branchId?: number;
  public isActive!: boolean;
  public isVerified!: boolean;
  public lastLogin?: Date;
  public passwordChangedAt?: Date;
  public resetPasswordToken?: string;
  public resetPasswordExpire?: Date;
  public twoFactorSecret?: string;
  public twoFactorEnabled!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Roles',
      key: 'id'
    }
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Companies',
      key: 'id'
    }
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Branches',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  passwordChangedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  resetPasswordExpire: {
    type: DataTypes.DATE,
    allowNull: true
  },
  twoFactorSecret: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  twoFactorEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  tableName: 'Users',
  timestamps: true,
  indexes: [
    { fields: ['email'] },
    { fields: ['companyId'] },
    { fields: ['roleId'] }
  ]
});

export default User;