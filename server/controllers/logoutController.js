const database = require('../model/dbConnect.js');

const handleLogout = (req,res) => {
    // On client, also delete the accessToken
    const cookies = req.cookies;

    if(!cookies?.jwt) return res.sendStatus(204); //successful, but no content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const loginQuery = "SELECT * FROM users WHERE refresh_token = ?";
    const deleteRefreshTokenQuery = "UPDATE users SET refresh_token=NULL WHERE refresh_token=?";
    
    database.query(loginQuery, [refreshToken],(err,data) => {

        if(err) {
            return res.status(500).send('Failed to execute query');
        }

        if(data.length <= 0) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure : true}); // , secure: true
            return res.sendStatus(204);//successful, with no content
        }
        
        //Delete refreshToken in db
        database.query(deleteRefreshTokenQuery, [data[0].refresh_token]);

        res.clearCookie('jwt', { httpOnly: true, sameSite: "None", secure : true}); // secure : true - only serves on https
        res.sendStatus(204);
        
    });
};

module.exports = {
    handleLogout
};