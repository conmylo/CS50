const {executeQuery} = require("../services/data.service");
const moment = require("moment");

async function fetchByListId(request, response) {
    const {id} = request.params;
    let query = `select * from items where listId = ${id}`;
    try {
        const items = await executeQuery(query);
        items.forEach(item => {
            item.addedAt = moment(item.addedAt).format('MM-DD-YYYY');
        });
        return response.status(200).json(items);
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function create(request, response) {
    try {
        const {description, listId} = request.body;
        const query = `insert into items (description, listId) values ('${description}', ${listId})`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function update(request, response) {
    try {
        const {id} = request.params;
        const {description, isCompleted} = request.body;
        const query = `update items set description = '${description}', isCompleted = ${isCompleted ? isCompleted : 0} where id = ${id}`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function deleteItemFromList(request, response) {
    try {
        const {id} = request.params;
        const {listId} = request.body;
        const query = `delete from items where id = ${id} and listId = ${listId}`;
        await executeQuery(query);

        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

module.exports = {
    fetchByListId,
    create,
    update,
    deleteItemFromList
}
