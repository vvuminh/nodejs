const express = require("express");
const router = express.Router();
const Todo = require('../models/Todo');
const Task = require('../models/Task');

router.post('/', async (req, res) => {
    let {name, priority, description, duedate} = req.body;
    try {
        let newTodo = await Todo.create({
            name,
            priority: parseInt(priority),
            description,
            duedate
        },{
                fields: ["name", "priority", "description", "duedate"]
        });
        if(newTodo) {
            res.json({
                result: 'ok',
                data: newTodo,
                name : newTodo.name
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: `Insert a new Todo failed`
            });
        }
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Insert a new Todo failed . Error: ${error}`
        })
    }
    // res.json({
    //     data : 'You send a post request'
    // })
});

router.put('/:id', async (req, res) => {
    const {id} = req.params;
    const { name, priority, description, duedate } = req.body;
    try {
        let todos = await Todo.findAll({
            attributes: ['id', 'name', 'priority', 'description', 'duedate'],
            where: {
                id
            }
        });
        if(todos.length > 0) {
            todos.forEach(async (todo) => {
              await todo.update({
                  name: name ? name : todo.name,
                  priority: priority ? priority : todo.priority,
                  description: description ? description : todo.description,
                  duedate: duedate ? duedate : todo.duedate
              });  
            });
            res.json({
                result: 'ok',
                data: todos,
                message: "update a Todo successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find Todo to update"
            });
        }
    } catch(error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Cannot update a Todo. Error: ${error}`
        });
    }
});

//Delete a Todo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.destroy({
            where: {
                todoid: id
            }
        });
        let numberOfDeletedRows = await Todo.destroy({
            where: {
                id
            }
        });
        res.json({
            result: 'ok',
            message: "Delete a Todo successfully",
            count: numberOfDeletedRows
        });	
    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `Delete a Todo failed. Error: ${error}`
        });
    }
});

//Query all data from DB
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.findAll({
            attributes: ['id', 'name', 'priority', 'description', 'duedate'],		
        });
        res.json({
            result: 'ok',
            data: todos,
            length: todos.length,
            message: "query list of Todos successfully"
        });
    } catch (error) {
        res.json({
            result: 'failed',
            data: [],
            length: 0,
            message: `query list of Todos failed. Error: ${error}`
        });
    }	
});

//Get by Id ?
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        let todos = await Todo.findAll({
            attributes: ['name', 'priority', 'description', 'duedate'],
            where: {
                id: id
            },
            include: {
                model: Task,
                as: 'tasks',
                required: false
            }
        });
        if (todos.length > 0) {
            res.json({
                result: 'ok',
                data: todos[0],
                message: "query list of Todos successfully"
            });
        } else {
            res.json({
                result: 'failed',
                data: {},
                message: "Cannot find Todo to show"
            });
        }

    } catch (error) {
        res.json({
            result: 'failed',
            data: {},
            message: `query list of Todos(by id) failed. Error: ${error}`
        });
    }
});
module.exports = router;
