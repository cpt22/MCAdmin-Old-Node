module.exports = function(app, router, conn, inc) {
    var bcrypt = inc.bcrypt;

    router.get('/server/server', function(req, res) {
        var session = req.session;
        if (!session.user) {
            res.redirect(inc.HOST + "/login/");
            return;
        }

        var user = inc.users[session.id];
        var serverID = req.query.s ? req.query.s : "";

        user.loadServers().then(function() {
            const server = user.getServer(serverID);
            if (!server) {
                res.status(404).render('404', {
                    title: 'MC Admin 404',
                    host: inc.HOST,
                    session: req.session
                });
                return;
            }

            server.loadServerToken().then(function () {
                res.render('server/server', {
                    title: "MC Admin Servers",
                    host: inc.HOST,
                    session: session,
                    user: user.asJSONObject(),
                    server: server.asJSONObject()
                });
            });
        });

    });
}