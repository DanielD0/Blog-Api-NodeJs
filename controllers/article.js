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
                status: 'error',
                message: 'Faltan Datos por enviar !!!'
            })
        }
        if(validate_title && validate_content){
        //Crear el objeto a guardar
            var article = new Article();
        //Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.img = null;
        //guardar articulos
            article.save((error,articleStore)=>{
                if(error || !articleStore){
                    return res.status(404).send({
                        status: 'error',
                        article: 'El articulo no se a guardado!!!'
                    })
                }
                return res.status(200).send({
                    article: articleStore
                })
            })
        }else{
            return res.status(200).send({
                status: 'error',
                article: 'Los datos no son validos'
            })
        }
        
        
     },
     
     getArticles: (req,res)=>{

        var last = req.params.last;
        var query = Article.find({});
        if(last || last!=undefined){
            query.limit(5);
        }
        //Find
        query.sort('-_id').exec((err,articles)=>{
            if (err){
                return res.status(500).send({
                    status:'error',
                    message:'Error al devolver los articulos'
                })
            } 
            if(!articles){
                return res.status(404).send({
                    status:'error',
                    message:'No hay articulos'
                })
            }
            return res.status(200).send({
                status:'succes',
                articles
            })
        });
        
     },

     getArticle: (req,res)=>{
        //Recoger id
            var articleId = req.params.id;
        //Comprobar que existe
        if(!articleId || articleId == null){
            return res.status(404).send({
                status:'error',
                message:'No Existe el articulo'
            })
        }
        //Buscar el articulo
        Article.findById(articleId,(err,article)=>{
            if(err || !article){
                return res.status(404).send({
                    status:'error',
                    message:'No existe el articulo'
                })
            }
            //Devolver el json
            return res.status(200).send({
                    status:'success',
                    article
            })
            })        
     }
};

module.exports = controller;