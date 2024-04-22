const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if(!req?.roles) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        console.log("rolesArray");
        console.log(rolesArray);
        console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)).find(val => val === true);

        if(!result) return res.send(401).status("role mismatched");
        next();
    };
};

module.exports = verifyRoles;