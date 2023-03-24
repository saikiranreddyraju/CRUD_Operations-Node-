const {validateSchema} = require("../validator/index ");
const {v4:uuidv4} = require('uuid');

const users = [];

const findUser = function (req,res){
    const userId = req.params.id;
    try {
        let currUser = users.find(function(user){
            return user.id===userId && user.isDeleted!==true
        });
        if(currUser){
            return res.status(200).json(currUser);
        }else{
            return res.status(400).json({"message":"User does not exist"});
        }
    } catch (error) {
        return res.status(400).json(error);
    }
}


const createUser = function (req,res){
    const userData = req.body;
    userData["id"] = uuidv4();
    
    // Perform validation of req.body data
    const {error,value} = validateSchema(userData);
    if(error){
        console.log(error);
        res.status(400).json(error.details);
    }
    try {
        users.push(userData);
        return res.status(200).json(value);
    } catch (error) {
        return res.status(400).json(error);
    }
    
}


const updateUser = function (req,res){
    const userId = req.params.id;
    const userData=req.body;
    try {
        let currUser=users.find(function(user){
            return user.id===userId && user.isDeleted!==true;
        });
        if(currUser){
            currUser.login=userData.login || currUser.login;
            currUser.password=userData.password || currUser.password;
            currUser.age=userData.age || currUser.age;
            currUser.isDeleted=userData.isDeleted || currUser.isDeleted;
    
            const {error,value} = validateSchema(currUser);
            if(error){
                console.log(error);
                return res.status(400).json(error.details);
            }else{
                return res.status(200).json(value);
            }
        }else{
            return res.status(400).json({"message":"User does not exist"});
        }
    } catch (error) {
        return res.status(400).json(error);
    }   
}

const getUsers = function(req,res){
    res.status(200).json(users);
}

const autoSuggestUsers = function (req,res){
    const loginSubstring = req.params.loginSubstring;
    const limit = req.params.limit;
    const matchedUsers = [];
    try {
        users.forEach(function(user){
            if(user.login.includes(loginSubstring) && user.isDeleted!==true){
                matchedUsers.push(user);
            }
        });
    
        if(matchedUsers.length===0){
            return res.status(400).json({"message":"No users matching the substring"});
        }
    
        matchedUsers.sort(compare);
        return res.status(200).json(matchedUsers.slice(0,limit));

    } catch (error) {
        return res.status(400).json(error);
    }
}

function compare(a,b){
    if(a.login<b.login) return -1;
    if(a.login > b.login) return 1;
    return 0;
}


const deleteUser = function (req,res){
    const userId=req.params.id;
    try {
        let user = users.find(function(user){
            return user.id===userId && user.isDeleted!==true
        });
        if(user){
            user.isDeleted=true;
            return res.status(200).json("Deleted Successfully");
        }else{
            return res.status(400).json({"message":"User does not exist"});
        }
    } catch (error) {
        return res.status(400).json(error);
    }
    
}

module.exports={
    findUser,
    createUser,
    updateUser,
    getUsers,
    autoSuggestUsers,
    deleteUser
};