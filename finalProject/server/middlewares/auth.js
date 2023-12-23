const {verify} = require("jsonwebtoken");
const {executeQuery} = require("../services/data.service");
const secret = 'JsonWebTokenSecret';


function auth(req, res, next) {
    const token = req.header('Authorization').replace('Bearer ', '');
    verify(token, secret, async (err, data) => {
        if (err) {
            return res.status(401).send("Token expired");
        }

        const selectUserQuery = `SELECT id, username, email, createdAt FROM users WHERE id=${data.id}`;
        const users = await executeQuery(selectUserQuery);

        if (users.length > 0) {
            const user = users[0];
            const roleQuery = `select roleId from userToRoles where userId = ${user.id}`;
            const roles = await executeQuery(roleQuery);
            user.roles = roles;
            req.user = user;
            next();
        } else {
            res.status(401).json({error: 'Not authorized to access this resource.'});
        }
    });
}

module.exports = auth;

