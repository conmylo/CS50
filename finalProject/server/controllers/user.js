const {fetchAll, fetchById, loginUser, signUserToken, deleteUserById, createUser, addUserToRole} = require('../services/user.service');
const moment = require("moment");

async function fetchAllUsers(request, response) {
    try {
        const users = await fetchAll();
        users.forEach(user => {
            user.createdAt = moment(user.createdAt).format('MM-DD-YYYY')
        })
        return response.status(200).json(users);
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function fetchMe(request, response) {
    try {
        const user = await fetchById(+request.user.id);
        if (user) {
            user.isAdmin = request.user.roles.some(role => role.roleId === 1);
            response.status(200).json(user);
        } else {
            response.status(404).json({message: 'User not found'});
        }
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function fetchUserById(request, response) {
    const {id} = request.params;
    try {
        const user = await fetchById(+id);
        if (user) {
            response.status(200).json(user);
        } else {
            response.status(404).json({message: 'User not found'});
        }
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function login(request, response) {
    const {username, password} = request.body;

    try {
        const user = await loginUser(username, password);
        if (!user) {
            return response.status(400).json({message: 'User not found'});
        }

        return response.status(200).json(signUserToken(user.id));
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function create(request, response) {
    try {
        const {username, password, email} = request.body;
        const user = await createUser(username, password, email);
        await addUserToRole(user.insertId);
        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

async function deleteUser(request, response) {
    try {
        const {id} = request.params;
        await deleteUserById(+id);
        return response.status(200).json({message: 'done'});
    } catch (e) {
        return response.status(400).json({message: e.message});
    }
}

module.exports = {
    create,
    deleteUser,
    fetchAllUsers,
    fetchMe,
    fetchUserById,
    login,
}
