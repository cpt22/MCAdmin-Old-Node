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
            this.permissions = {};
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

        async loadServers() {
            const serversResult = await conn.promise().query('SELECT * FROM users_servers WHERE user_ID=?', [this.id]);
            const permsResult = await conn.promise().query('SELECT * FROM user_permission WHERE user_ID=?', [this.id])

            this.servers = [];
            this.permissions = {};
            if (serversResult[0].length > 0) {
                for (var i = 0; i < serversResult[0].length; i++) {
                    const s = serversResult[0][i];
                    const server = await Server.build(s.ID);
                    console.log(s);
                    server.role = s.role;
                    this.servers.push(server);
                }
            }
            if (permsResult[0].length > 0) {
                for (var i = 0; i < permsResult[0].length; i++) {
                    const p = permsResult[0][i];
                    if (!this.permissions[p.server_ID]) {
                        this.permissions[p.server_ID] = [];
                    }
                    this.permissions[p.server_ID].push(p.permission);
                }
            }
            return;
        }

        getServer(serverID) {
            for (var i = 0; i < this.servers.length; i++) {
                var server = this.servers[i];
                if (server.id == serverID) {
                    return server;
                }
            }
            console.log("wtf");
            return null;
        }

        hasPermission(serverID, permission) {
            const s = this.permissions[serverID];
            if (s) {
                return s.includes(permission);
            }
            return false;
        }

        asJSONObject() {
            return JSON.parse(JSON.stringify(this, null ,4));
        }

        asJSONString() {
            return JSON.stringify(this, null ,4);
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
            this.playersOnline = 0;
        }

        async loadPlayers() {
            if (!this.id) {return;}
            const result = await conn.promise().query('SELECT * FROM players_with_servers WHERE server_ID=?', [this.id]);
            this.players = [];

            if (result[0].length > 0) {
                this.playersOnline = 0;
                for (var i = 0; i < result[0].length; i++) {
                    const player = result[0][i];
                    if (player.status == '1') {
                        this.playersOnline++;
                    }
                    this.players.push(new Player(player.username, player.uuid, player.lastSeen, player.status, player.banned, this.id));
                }
            }
            return;
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

        async loadServerToken() {
            const result = await conn.promise().query('SELECT token FROM servers WHERE ID=?', [this.id]);

            if (result[0].length == 1) {
                const row = result[0][0];
                this.token = row.token;
            }
            return;
        }

        getPlayer(identifier) {
            for (var p in players) {
                if (p.username === identifier || p.uuid === identifier)
                    return p;
            }
        }

        asJSONObject() {
            return JSON.parse(JSON.stringify(this, null ,4));
        }

        asJSONString() {
            return JSON.stringify(this, null ,4);
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

        asJSONObject() {
            return JSON.parse(JSON.stringify(this, null ,4));
        }

        asJSONString() {
            return JSON.stringify(this, null ,4);
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
