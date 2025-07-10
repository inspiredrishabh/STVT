const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Candidate = require('./Candidate');
const { all } = require('../routes/attendanceRoutes');

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
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    theoryStatus: {
        type: DataTypes.ENUM('present', 'absent'),
    },
    practicalStatus: {
        type: DataTypes.ENUM('present', 'absent'),
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    tableName: 'attendances',
    timestamps: true
});

// Associate Attendance with Candidate
Attendance.belongsTo(Candidate, { foreignKey: 'candidateId' });
Candidate.hasMany(Attendance, { foreignKey: 'candidateId' });

module.exports = Attendance;
