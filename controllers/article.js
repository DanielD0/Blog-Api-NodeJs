'use strict'

var validator = require('validator')
var fs = require('fs')
var path = require('path')
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
            article.image = null;
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
     },

     update: (req,res)=>{
        //Recoger el id del articulo por la url
        var articleId = req.params.id;
        //Recoger los datos que llegan por put
        var params = req.body;
        //Validar los datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (error) {
            return res.status(404).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            })
        }
        if(validate_title && validate_content){
            //Find and update
            Article.findByIdAndUpdate({_id:articleId},params,{new:true},(error,articleUpdated)=>{
                if(error){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar !!!'
                    })
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'La validacion no es correcta !!!'
                    })
                }
                return res.status(200).send({
                    status:'success',
                    article: articleUpdated
                });  
            });
        }else{
            return res.status(200).send({
                status:'error',
                message: 'La validacion no es correcta'
            })  
        }
    },
    delete: (req,res) =>{
        //Recoger el id de la url
            var articleId = req.params.id;
        //Find and delete
            Article.findOneAndDelete({_id: articleId},(error,articleRemoved)=>{
                if(error){
                    return res.status(500).send({
                        status:'error',
                        message: 'Error al borrar'
                    }) 
                }

                if(!articleRemoved){
                    return res.status(404).send({
                        status:'error',
                        message: 'No se ha borrado el articulo, probablemete no exista!!!'
                    }); 
                }

                return res.status(200).send({
                    status:'succes',
                    article: articleRemoved
                }) 
            })   
    },
    upload:(req,res)=>{
        //configurar el modulo connect multiparty router/article.js

        //Recoger el fichero de la peticion
        var filename = 'imagen no subida...';
        if(!req.files){
            return res.status(404).send({
                status:'error',
                message:filename
            }) 
        }
        //Conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');
        // *ADVERTENCIA* EN LINUX O MAC
        //var file_split = file_path.split('/');

        //Nombre del archivo
        var filename = file_split[2]

        //Extension del archivo
        var extension_split = filename.split('\.');
        var file_ext = extension_split[1];

        //Comprobar la extension, solo imagenes si es valido borrar el fichero
        if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
            //Borrar el archivo subido
            fs.unlink(file_path,(err)=>{
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es valida'
                })
            })
        }else{
             //si todo es valido
            var articleId = req.params.id;
            //Buscar el articulo,asignarle el nombre de la imagen y actualizarlo
            Article.findOneAndUpdate({_id: articleId},{image:filename},{new:true},(error,articleUpdate) =>{
                if(error || !articleUpdate){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al subir la imagen'
                    })
                }

                return res.status(200).send({
                   status: 'success',
                   article: articleUpdate
                });
            })
        }
    },

    getImage:(req,res)=>{
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

       if(fs.existsSync(path_file)){
        return res.sendFile(path.resolve(path_file));
       }else{
        return res.status(404).send({
            status: 'error',
            mesagge: 'la imagen no existe'
        });
       }

    },

    search:(req,res)=>{
        //sacar el string a buscar
        var searchstring = req.params.search;
        //Find or
        Article.find({ "$or":[
            {"title":{"$regex":searchstring,"$options":"1"}},
            {"content":{"$regex":searchstring,"$options":"1"}},
        ]}).sort([['date','descending']])
        .exec((err,articles)=>{
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion!!!'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidad con tu busqueda!!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        })
        
    }
};

module.exports = controller;