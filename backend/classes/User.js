module.exports = function(conn) {
    class User {
        constructor (username, email, id) {
            /*if (typeof async_param === 'undefined') {
                throw new Error('Cannot be called directly');
            }*/
            this.username = username;
            this.email = email;
            this.id = id;
        }

        static async build(username) {
            const result = await conn.promise().query('SELECT * FROM users WHERE username=?', [username]);
            const row = result[0][0];
            return new User(row.username, row.email, row.ID);
        }
    }
    return User;
}
