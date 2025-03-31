
const Category = require('../models/Category')
const Recipe = require('../models/Recipe');

/**
 * GET  /
 * Homepage
 */

const homepage = async(req,res)=>{
    try{
        const limitNumber = 5;
        const categories = await Category.find({}).limit(limitNumber);
        const latest = await Recipe.find({}).sort({_id:-1}).limit(10);
        // const data = latest[0].description.split('.');
        const thai = await Recipe.find({category:'Thai'}).limit(limitNumber);
        const american = await Recipe.find({category:'American'}).limit(limitNumber);
        const  indian = await Recipe.find({category:'Indian'}).limit(limitNumber);
        const food = {latest,thai,american,indian};
        // console.log(latest,food.latest);
        // console.log(thai,american);
        res.render('index',{title:"Cooking Blog - Home",categories,food});
    }catch(e)
    {
       res.status(500).send({message:e.message || "Error Occured"})
    }
}

/**
 * GET  /categories
 * Categories
 */

const exploreCategories = async(req,res)=>{

    try {
        
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories',{title: 'Cooking Blog - Categories',categories,categoryName:null});

    } catch (error) {
        res.status(500).send({message:e.message || "Error Occured"});
    }

}

/**
 * GET /recipe/:id
 * Recipe page
 */

const exploreRecipe = async(req,res)=>{

    try {
        
        let recipeId = req.params.id;
        const recipe = await Recipe.findById(recipeId);


        res.render('recipe',{title:'Cooking Blog - Recipe', recipe});

    } catch (error) {
        res.status(500).send({message:error.message || "Error Occured"});
    }
  
}

/**
 * GET  /categories/:id
 * Categories
 */

const exploreCategoriesByID = async(req,res)=>{

    try {
        
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoryData = await Recipe.find({'category':categoryId}).limit(limitNumber);
         
        res.render('categories',{title : 'Cooking Blog - Categories',categoryData,categoryName:categoryId});
    } catch (error) {
        res.status(500).send({message:error.message || " Error Occured :("});
    }
}

/**
 * POST /search
 * SearchPage
 */

const seachRecipe = async(req,res)=>{

    try {

        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({$text:{$search:searchTerm,$diacriticSensitive:true}});
        // res.json(recipe);
        res.render('search',{title : "Cooking Blog - Search",recipe});
        
    } catch (error) {
        
        res.status(500).send({message:error.message || "No such food recipe present"});

    }
}


/**
 * GET /explore-latest
 * Explore-Latest page
 */


const exploreLatest = async(req,res)=>{

    try {

        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id:-1}).limit(limitNumber);
        
        res.render("explore-latest",{title : 'Cooking Blog - Latest Recipe',recipe});
    } catch (error) {
        
        res.status(500).send({message : error.message || "Error Occured in explore Section"});

    }
}


/**
 * GET /random-recipe
 * Explore-Latest page
 */


const randomRecipe = async(req,res)=>{
    
    try{

      let count = await Recipe.find().countDocuments();
      let random = Math.floor(Math.random()*count);
      let recipe = await Recipe.findOne().skip(random).exec();
      res.render("random-recipe",{title:"Cooking Blog - Random Recipe",recipe});
    }catch(error)
    {
        res.status(500).send({message:error.message || "Error Occured on getting random recipe"})
    }

}

/**
 * GET /submit-recipe
 * submit-recipe page
 */

const submitRecipe = async(req,res)=>{

    try {
        
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        
        res.render('submit-recipe',{title : "Cooking Blog - Submit Recipe",infoErrorsObj,infoSubmitObj});

    } catch (error) {

        res.status(500).send({message:error.message || "Error Occured on Submit Recipe page"});
        
    }

}

/**
 * POST /submit-recipe
 * submit-recipe page
 */

const submitRecipeOnPost = async(req,res)=>{
   
    try {


        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if(!req.files || Object.keys(req.files).length === 0)
        {
            console.log('No files were uploaded');
        }else{

            imageUploadFile = req.files.image;
            newImageName = Date.now() +'-'+ imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/'  + newImageName;
            await imageUploadFile.mv(uploadPath,function(err){
                if(err)return res.status(500).send(err);
            })
        }
        
        const newRecipe = new Recipe({
            name:req.body.name,
            description:req.body.description,
            email:req.body.email,
            ingredients:req.body.ingredients,
            category:req.body.category,
            image:newImageName,
        })
        
        await newRecipe.save();
        // console.log(newRecipe);

        req.flash('infoSubmit',"Recipe has been added");
        res.redirect('/submit-recipe');

    } catch (error) {
        req.flash('infoErrors',error);
        res.redirect('/submit-recipe')
    }

   

}

module.exports= {
    homepage,
    exploreCategories,
    exploreRecipe,
    exploreCategoriesByID,
    seachRecipe,
    exploreLatest,
    randomRecipe,
    submitRecipe,
    submitRecipeOnPost
}