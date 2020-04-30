module.exports = function(conn) {

    /**
     * User Class
     */
    class User {
        constructor (username, email, id) {
            this.username = username;
            this.email = email;
            this.id = id;
            this.servers = [];
        }

        async loadServers() {
            const result = await conn.promise().query('SELECT ID FROM users_servers WHERE user_ID=?', [this.id]);

            this.servers = [];
            if (result[0].length > 0) {
                for (var i = 0; i < result[0].length; i++) {
                    const s = result[0][i];
                    const server = await Server.build(s.ID);
                    this.servers.push(server);
                }
            }
            return;
        }

        getServer(serverID) {
            for (var s in servers) {
                if (s.id === serverID)
                    return s;
            }
        }

        asJSONObject() {
            return JSON.parse(JSON.stringify(this, null ,4));
        }

        asJSONString() {
            return JSON.stringify(this, null ,4);
        }

        static async build(username) {
            const result = await conn.promise().query('SELECT * FROM users WHERE username=?', [username]);

            if (result[0].length == 1) {
                const row = result[0][0];
                const u = new User(row.username, row.email, row.ID);
                await u.loadServers();
                return u;
            } else {
                return null;
            }
        }
    }


    /**
     * Server Class
     */
    class Server {
        constructor (name, ip, id) {
            this.name = name;
            this.ip = ip;
            this.players = [];
            this.id = id;
            //this.playersOnline = 0;
        }

        async loadPlayers() {
            if (!this.id) {return;}
            const result = await conn.promise().query('SELECT * FROM players_with_servers WHERE server_ID=?', [this.id]);
            this.players = [];

            if (result[0].length > 0) {
                this.playersOnline = 0;
                for (var i = 0; i < result[0].length; i++) {
                    const player = result[0][i];
                    //this.playersOnline+=player.status;
                    this.players.push(new Player(player.username, player.uuid, player.lastSeen, player.status, player.banned, this.id));
                }
            }
            return;
        }

        getPlayer(identifier) {
            for (var p in players) {
                if (p.username === identifier || p.uuid === identifier)
                    return p;
            }
        }

        static async build(serverID) {
            const result = await conn.promise().query('SELECT * FROM servers WHERE ID=?', [serverID]);

            if (result[0].length == 1) {
                const row = result[0][0];
                const s = new Server(row.name, row.ip, row.ID);
                await s.loadPlayers();
                return s;
            } else {
                return null;
            }
        }
    }

    /**
     * Player Class
     */
    class Player {
        constructor (username, uuid, lastSeen, status, banned, serverID) {
            this.username = username;
            this.uuid = uuid;
            this.lastSeen = lastSeen;
            this.status = status;
            this.banned = banned;
            this.serverID = serverID;
        }

        static async build(username) {
            return null;
        }
    }


    /**
     * Return classes to exports
     */
    return {
        User: User,
        Server: Server,
        Player: Player
    };
}
