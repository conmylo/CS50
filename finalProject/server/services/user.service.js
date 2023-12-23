const {executeQuery} = require("./data.service");
const {sign} = require("jsonwebtoken");
const secret = 'JsonWebTokenSecret';
const expiresIn = '1h';
async function loginUser(username, password) {
    try {
        const query = `select id from users where username = '${username}' and password = '${password}'`;
        const users = await executeQuery(query);
        if (users.length > 0) {
            return users[0];
        } else {
            return null;
        }
    } catch (e) {
        throw e;
    }
}

//Add user from default to role "User"
async function addUserToRole(userId) {
    const query = `insert userToRoles (userId, roleId) values (${userId}, 2)`;
    await executeQuery(query);
}

async function createUser(username, password, email) {
    const query = `Insert into users (username, password, email) values ('${username}', '${password}', '${email}')`;
    return await executeQuery(query);
}

async function fetchById(userId) {
    const query = `select id, username, email, createdAt from users where id = ${userId}`;
    const users = await executeQuery(query);
    return users && users.length > 0 ? users[0] : null;
}

async function deleteUserById(userId) {
    const query = `delete from users where id =${userId}`;
    return await executeQuery(query);
}

async function fetchAll() {
    const query = `select u.id, u.username, u.email, u.createdAt, r.description as role from users u
left join userToRoles utr on u.id = utr.userId
left join roles r on r.id = utr.roleId`;

    return await executeQuery(query);
}

function signUserToken(userId) {
   return  sign({
        id: userId,
    }, secret, {
        expiresIn: expiresIn
    });
}

module.exports = {loginUser, createUser, deleteUserById, fetchById, fetchAll, signUserToken, addUserToRole};
