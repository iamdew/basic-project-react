import jwt from 'jsonwebtoken';
import models from '../models';

const secretKey = global.secretKey;

export default module.exports = {
    login(req, res) {
        models.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'No user'
                });
            }
            if (user.password !== req.body.password) {
                return res.json({
                    success: false,
                    meesage: 'Invalid password'
                });
            }
            // return user token
            res.json({
                success : true,
                message : 'this is your token',
                token : user.token
            });
        });
    },
    auth(req, res, next) {
        var token = req.body.token || req.params.token || req.headers['x-access-token'];
        if (token){
            jwt.verify(token, secretKey, (err, decoded) => {
                if (err) {
                    return res.status(403).send({
                        success : false,
                        message : 'Invalid token'
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success : false,
                message : 'No token'
            });
        }
    }
};
