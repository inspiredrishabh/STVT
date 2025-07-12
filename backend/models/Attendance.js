const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Candidate = require('./Candidate');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Candidates',
            key: 'id'
        }
    },
    ticketNo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    totalClasses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    classesAttended: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
}, {
    tableName: 'attendances',
    timestamps: true
});

// Associate Attendance with Candidate
Attendance.belongsTo(Candidate, { foreignKey: 'candidateId' });
Candidate.hasMany(Attendance, { foreignKey: 'candidateId' });

module.exports = Attendance;
