const db = require('../db');

const getOwnerUser = async function (token) {
    let authorization_token = token.split(' ')[1];
    return await db.select().from('user').where('token', authorization_token);

}
module.exports = {
    getOwnerUser
}