var express = require('express');
var router = express.Router();
var fs = require('fs');
const bcrypt = require('bcrypt')

// Seguindo a lógica o usuário deverá criar um perfil com usuário e senha esta que deverá ser criptografada

router.post("/signup", (req,res)=>{
    let {user,password,email}= req.body
    
    if(user&&password.length>6&&email.includes('@')){
        //depois de verificado se existe usuario e password válido é feita consulta no banco se o usuario já existe
        
        fs.readFile('./data/usersAuth.json', "utf-8", async (err, data) => {
            try {
                const usersAuth = JSON.parse(data)
                    
                
                const userAlreadyExisted = usersAuth.filter(userAuth=>userAuth.email === email)
                //se o usuário existir um aviso deve ser retornado
                
                if(userAlreadyExisted.length>0){
                    res.status(422)
                    res.send({"erro":"Usuario já existente"})
                }else{
                    //Se o usuário já não existir então é permitido o cadastrado do usuário
                   
                    //a senha deve ser criptografada / utilizado o bcrypt que solicita uma função async
                    let passwordHashed= await bcrypt.hash(password, 8)
                    
                    const newUser = {
                        "user":user,
                        "email":email,
                        "password":passwordHashed
                    }
                   usersAuth.push(newUser)
                   try{
                    fs.writeFileSync('./data/usersAuth.json', JSON.stringify(usersAuth) )
                    res.send({"user":newUser.user,"email":newUser.email})
                   }catch(error){
                    res.status(500)
                    res.send({"erro":error})
                   }
                       
                    
                    
                }
            } catch {
                res.status(500)
                res.send({"erro":err})
            }
    
        })
    }else{
        res.status(422)
        res.send({"erro":"campos incompletos"})
    }
})



module.exports = router;