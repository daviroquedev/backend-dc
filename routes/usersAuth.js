var express = require('express');
var router = express.Router();
var fs = require('fs');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
// Seguindo a lógica o usuário deverá criar um perfil com usuário e senha esta que deverá ser criptografada

router.post("/signup", (req,res)=>{
    //nesta linha são armazenados valores vindos do corpo da requisição 
    let {user,password,email}= req.body
    //nesta linha são conferidos se existe usuario, senha e email válidos
    if(user&&password.length>6&&email.includes('@')){
        //depois de verificado se existe usuario e password válido é feita consulta no banco se o usuario já existe
        
        fs.readFile('./data/usersAuth.json', "utf-8", async (err, data) => {
            try {
                const usersAuth = JSON.parse(data)
                    
                
                const userAlreadyExists = usersAuth.filter(userAuth=>userAuth.email === email)
                //se o usuário existir um aviso deve ser retornado
                
                if(userAlreadyExists.length>0){
                    //o array userAlreadyExists é maior que 0 quando existir usuario
                    res.status(422)
                    res.send({"erro":"Usuario já existente"})
                }else{
                    //Se o usuário  não existir então é permitido o cadastrado do usuário
                   
                    //a senha deve ser criptografada / utilizado o bcrypt que solicita uma função async
                    let passwordHashed= await bcrypt.hash(password,eval(process.env.SALT_HASH))
                    
                    const newUser = {
                        "user":user,
                        "email":email,
                        "password":passwordHashed
                    }
                   usersAuth.push(newUser)
                   try{
                    fs.writeFileSync('./data/usersAuth.json', JSON.stringify(usersAuth) )
                    res.status(201)
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
router.post('/login',(req,res)=>{
    let {email, password}= req.body
   
    if(email.length>0&&password.length>6){
        fs.readFile('./data/usersAuth.json',async (err,data)=>{
            try{
               const usersAuth = JSON.parse(data)

               let userToBeVerified = usersAuth.filter((user)=>user.email === email)
               if(userToBeVerified.length>0){
                // criptografar senha enviada do usuario para comparar com a do banco
                await bcrypt.compare(password, userToBeVerified[0].password,(err,result)=>{
                    if(result){
                        //avisar que a senha é valida 200 
                        const token = jwt.sign(
                            {"user":userToBeVerified.user, "email":userToBeVerified.email},
                            process.env.JWT_SECRET,
                            {expiresIn: '1h'}
                            )
                        res.send({"auth":true, "token":token})    
                    }else{
                        res.status(401)
                        res.send({"erro":err})
                    }
                })
                
               }
            }catch{
              res.status(500)
              res.send({"erro":"ocorreu um erro na verifição, tente novamente"})  
            }
        })
    }else{
        res.status(422)
        res.send({"erro":"Todos os campos devem estar completos"+ err})
    }
})




module.exports = router;