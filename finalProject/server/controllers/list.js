const {isAdmin} = require("../services/common.service");
const {executeQuery} = require("../services/data.service");
const moment = require("moment");

async function fetchAll(request, response) {
    const user = request.user;
    const adminQuery = `select l.id, l.title, l.createdAt, l.isCompleted, u.username as user from list l
left join users u on u.id = l.userId`;
    let query = !isAdmin(user.roles) ? `select * from list where userId = ${user.id}` : adminQuery;
    try {
        const lists = await executeQuery(query);
        lists.forEach(list => {
            list.createdAt = moment(list.createdAt).format('MM-DD-YYYY');
        })
        return response.status(200).json(lists);
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function fetchById(request, response) {
    const user = request.user;
    const {id} = request.params;
    let query = !isAdmin(user.roles) ? `select * from list where userId = ${user.id} and id = ${+id}` : `select * from list where id = ${+id}`;
    try {
        const lists = await executeQuery(query);
        return response.status(200).json(lists);
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function create(request, response) {
    try {
        const user = request.user;
        const {title} = request.body;
        const query = `insert into list (title, userId) values ('${title}', ${+user.id})`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function update(request, response) {
    try {
        const {id} = request.params;
        const {isCompleted, title} = request.body;
        const query = `update list set title = '${title}', isCompleted = ${isCompleted ? isCompleted : 0} where id = ${id}`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function deleteList(request, response) {
    try {
        const {id} = request.params;
        const query = `delete from list where id = ${id}`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

module.exports = {
    fetchAll,
    fetchById,
    create,
    update,
    deleteList
}
