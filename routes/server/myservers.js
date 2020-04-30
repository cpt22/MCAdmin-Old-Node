module.exports = function(app, router, conn, inc) {
    var bcrypt = inc.bcrypt;
    const User = inc.User;
    const Server = inc.Server;
    const Player = inc.Player;

    router.get('/server/myservers', function(req, res) {
        var session = req.session;
        if (!session.user) {
            res.redirect(inc.HOST + "/login/");
        } else {
            var user = inc.users[session.id];

            user.loadServers().then(function() {

                res.render('server/myservers', {
                    title: "MC Admin Servers",
                    host: inc.HOST,
                    session: session,
                    user: user.asJSONObject()
                });
            });
        }
    });
}