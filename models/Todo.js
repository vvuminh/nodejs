//Do the same as Task
const Sequelize = require('sequelize');
const sequelize = require('../databases/database').sequelize;
const Op = require('../databases/database').Op;
const Task = require('./Task');

const Todo = sequelize.define('todo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING
    },
    priority: {
        type: Sequelize.TINYINT
    },
    description: {
        type: Sequelize.TEXT
    },
    duedate: {
        type: Sequelize.DATE
    }
}, {
        // don't add the timestamp attributes (updatedAt, createdAt)
        timestamps: false,
    });
Todo.hasMany(Task, { foreignKey: 'todoid', sourceKey: 'id' });  // bieẻu diễn quan hẹ 1-n
Task.belongsTo(Todo, { foreignKey: 'todoid', targetKey: 'id' });
module.exports = Todo;