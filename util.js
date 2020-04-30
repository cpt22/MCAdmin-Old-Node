module.exports = function(conn) {
    require('dotenv').config();

    const HOST = process.env.HOST;

    var bcrypt = require('bcrypt');

    const {check, validationResult} = require('express-validator');
    const Validator = require('./backend/util/Validator');
    const Tokenizer = require('./backend/util/Tokenizer')(conn);

    /*const User = require('./backend/classes/User')(conn);
    const Server = require('./backend/classes/Server')(conn);
    const Player = require('./backend/classes/Player')(conn);*/
    const {User, Server, Player} = require('./backend/classes/Classes')(conn);

    const users = require('./backend/util/users');

    return {
        HOST: HOST,
        check: check,
        validationResult: validationResult,
        Validator: Validator,
        Tokenizer: Tokenizer,
        bcrypt: bcrypt,
        User: User,
        Player: Player,
        Server: Server,
        users: users
    };
}