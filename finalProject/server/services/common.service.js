function isAdmin(roles) {
    return roles.some(role => role.roleId === 1);
}

module.exports = {
    isAdmin
}
