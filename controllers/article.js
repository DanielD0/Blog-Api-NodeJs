'use strict'

var validator = require('validator')
var Article = require('../models/article') 

var controller = {

    datosCurso:(req,res)=>{
        return res.status(200).send(
         {
             curso: "Master en frmaworks Js",
             autor: "Daniel Diaz",
             url: "danieldiaz"
         }
        );
     },

     test: (req,res)=>{
        return res.status(200).send({
            message: 'Soy la accion test de mi controlador'
        })
     },

     save: (req,res)=>{
        //Recoger parametro por post
        var params = req.body;
        console.log(params);
        //Validar datos(validator)
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        }catch(err){
            return res.status(200).send({
                message: 'Faltan Datos por enviar !!!'
            })
        }
        if(validate_title && validate_content){
        //Asignar valores

        //guardar articulos

        //Devolver una respuesta
            return res.status(200).send({
                article: params
            })
        }else{
            return res.status(200).send({
                article: 'Los datos no son validos'
            })
        }
        
        
     }
     
};

module.exports = controller;