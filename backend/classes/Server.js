module.exports = function(conn) {
    class Server {
        constructor (name, ip, players, id) {
            /*if (typeof async_param === 'undefined') {
                throw new Error('Cannot be called directly');
            }*/
            this.name = name;
            this.ip = ip;
            this.players = players;
            this.id = id;
        }

        static async build(serverID, session) {
            var players = [Player];
            const userID = session.user.id;
            const result = await conn.promise().query('SELECT * FROM users_servers WHERE server_id=? AND user_ID=?', [serverID, userID]);
            const row = result[0][0];

            if (result.length == 1) {

                return new Server(row.username, row.email, row.ID);
            } else {
                return null;
            }
        }
    }


    return Server;
}