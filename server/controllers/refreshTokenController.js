const database = require('../model/dbConnect.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req,res) => {
    
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(401);

    const refreshToken = cookies.jwt;

    const loginQuery = "SELECT * FROM users WHERE refresh_token= ?";

    const rolesQuery = "SELECT role, candidate_name FROM users WHERE refresh_token = ?";

    // const rolesQuery = "SELECT user_roles.role_id FROM login JOIN user_roles_mapping ON login.id = user_roles_mapping.user_id JOIN user_roles ON user_roles_mapping.role_id = user_roles.role_id WHERE login.refresh_token = ?";

    // database.query(rolesQuery, [refreshToken], (err, roleData) => {
        
        // const roles = roleData.map(row => row.role_id);
        // console.log("refreshTokenController " + roles);

        database.query(loginQuery, [refreshToken],(err,data) => {

            if(err) {
                return res.status(500).json('Failed to execute query');
            }
    
            if(data.length <= 0) {
                return res.sendStatus(403);//Forbidden
            }

            const userRoles = data[0].role;
            const roles =  userRoles.split(',').map(role => parseInt(role));
            
            // evaluate jwt
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded) => {
                    if(err || data[0].candidate_name !== decoded.username) return res.sendStatus(403);
    
                    const accessToken = jwt.sign(
                        { 
                            "UserInfo": {
                                "username": decoded.username,
                                "roles": roles,
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn: "10800s"} // 3 hours
                    );
                    res.json({ accessToken, roles });
                }
            );
        });
    // });
};

module.exports = {
    handleRefreshToken
};