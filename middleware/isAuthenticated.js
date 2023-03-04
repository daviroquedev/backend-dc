var express = require('express');
var fs = require('fs');
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.isAuthenticated= async (req,res,next)=>{
    try{
    const token = req.headers['x-access-token']
    if(!token){
        res.status(401)
        return res.send({auth:false, message:"token não fornecido"})
    }
    //Tendo um token é extraído o payload para repassar as informacoes 
    //usado o método verify para extrair
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
        //Na funçao anonima podemos ter o retorno do token decodificado utilizado o secret ou ocorrer um erro
        //Para o erro
        if(err){
            res.status(500)
            res.send({auth:false, message:"Falha na autenticação"})
        }
        req.user = decoded  // retornando o usuario vindo do token
        console.log(decoded)
        next()
    })
}catch(err){
    res.status(401)
    res.send({"erro":"header não enviado"})
}
}
