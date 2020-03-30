import Search from './models/Search';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

import { elements, renderLoader, clearLoader } from './views/base';
import List from './models/List';
import Likes from './models/Likes';e

const state = {};
let s;  //search
let r;  //recipe
let list; //list
let likes;  //likes

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    // testing****************
    const query = 'pizza';  
    // const query = searchView.getInput();


    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);
        s = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await s.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(s.result);
        } catch (err) {
            alert('Something wrong with the search controller');
            clearLoader();
        }
    }
}

// testing el *****
window.addEventListener('load',e=>{
    e.preventDefault();
    controlSearch();    
})

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});


// add a new event delegation to load code on next page
elements.searchResPages.addEventListener('click', e =>{
    //  problem is how to identify the target from the click
    const btn = e.target.closest('.btn-inline');   //****************************

    if(btn){
        const gotoPage = parseInt(btn.dataset.goto, 10);  //to get the value from object
        console.log(gotoPage);
        searchView.clearResults();
        searchView.renderResults(state.search.result,gotoPage); //change page   
    }
    
});


/*
*  RECIPE CONTROLLER
*/

// it read data from the page url
// respond to the #id changes event
// one EL for multiple events

likes = new Likes();
const controlRecipe = async() =>{
    // 1. get the id from the URL
    const id = window.location.hash.replace('#','');    // fetch the hash from the window url
    console.log(id);
    if(id){
        // 2. prepare UI for the changes
        renderLoader(elements.recipe);  // loading icon
        // highlight item in search
        if(state.search){
            searchView.highlightSelected(id);
        }

        // 3. creating the recipe object and get data back
        r = new Recipe(id);
        state.recipe = new Recipe(id);

        // testing***********
        // expose the recipe window to the global, so to access
        // hence, can access from CONSOLE window
        // window.r = state.recipe;

        try{
            await r.getRecipe();
            console.log('parsing ingredients');
            r.parseIngredients();
            console.log('parsed*****');  //verified


            // 4. call the extra functions calcTime...
            r.calcTime();
            r.calcServing();  


            // 5. render/inject the recipe in html
            // console.log(state.recipe);
            clearLoader();    
            recipeView.renderRecipe(r,likes.isLiked(id));
            document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#icon-heart-outlined`);    
            
        }catch(error){
            alert('in recipe controller, ',error);
            // clearLoader();
        }
    }
};

// url change EL
// window.addEventListener('hashchange',controlRecipe);

// // add EL to load the page directly from the URL
// window.addEventListener('load', controlRecipe);

// combo of both EL
['hashchange', 'load'].forEach(event => window.addEventListener(event,controlRecipe));

/*
    List Handler
*/
const controlList = () =>{
    console.log('in control list');
    
    if(!list){
        list = new List();
    }

    // add  each ing to list
    // ing at recipe
    r.ingredients.forEach(el=>{
        console.log(el);
        
        const item = list.addItem(el.count,el.unit,el.ingredient);
        console.log(item);
        listView.renderItem(item);
    })
}

// handle delete and update of items in list
elements.shopping.addEventListener('click',e=>{
    // can travel in DOM structure with '.' **************************
    const id = e.target.closest('.shopping__item').dataset.itemid;
        
    if(e.target.parentNode.parentNode.className.includes('shopping__delete btn-tiny') ||
    e.target.parentNode.className.includes('shopping__delete btn-tiny')){
        console.log('delete');
        
        //delete from model
        list.deleteItem(id);
        //delete from UI
        listView.deleteItem(id);
    }
    else if(e.target.className.includes('shopping__count-value')){
        // handle count update (+/-)
        console.log('+/-');
        
        const val = parseFloat(e.target.value,10);
        list.updateCount(id,val);
    };
    
    
    
});


/*
Like Controller
*/

likesView.toggleLikeMenu(likes.getNumLikes());      //hides like button in start
const controlLikes =() =>{ //trigered when like is clicked
    // if(!likes) likes = new Likes();
    const currentID = r.id;

    console.log('in likes, id= ',r.id,' =',likes);  
    if(!likes.isLiked(r.id)){
    // case 1> recipe is not like, add in like list
        // add like to state
        const newLike = likes.addLike(
            currentID,
            r.title,
            r.author,
            r.img
        )
        // toggle like button
        likesView.toggleLikeBtn(true);
        // add like to ui
        likesView.renderLike(newLike);
        console.log('1likes = ',likes);
    }else{
    // case 2> recipe is liked, remove from like list
        likes.deleteLike(currentID);
            // remove from UI
        likesView.toggleLikeBtn(false);
        console.log('going to delet');
        
        likesView.deleteLike(currentID);
        console.log('deleted');
        likesView.renderLike(newLike);
        console.log('2likes = ',likes);
    }

    likesView.toggleLikeMenu(likes.getNumLikes()); //to check wheather to dsplay like lsit or not
}


// restoring likes **************
window.addEventListener('click',e=>{
    // each time page load
    // create new like obj and fill from localstorage
    likes = new Likes();
    likes.readStorage();        // load json string to js obj
    likesView.toggleLikeMenu(likes.getNumLikes());

    // to restore each elem, and render
    likes.likes.forEach(like => likesView.renderLike(like));
})

// handling recipe button clicks
// inc/dec of servings

// ******* recipe main page
elements.recipe.addEventListener('click', e=>{//********* recipe controller + list controller
    console.log(e);
    // in recipe controller main page
    if(e.target.parentNode.parentNode.className.includes('btn-decrease')){   //* means any child of decrease
        r.updateServings('dec');    //small buttons to add servings
        recipeView.updateServingsIngredients(r);
    }else if(e.target.parentNode.parentNode.className.includes('btn-increase')){
        r.updateServings('inc');
        recipeView.updateServingsIngredients(r);
    }else if (e.target.closest('.recipe__btn--add')){     //for LIST
        console.log(e); // button at low end of page
        // adding inng to shopping list
        controlList();
    }else try{if(e.target.parentNode.className.includes('recipe__love') || e.target.parentNode.parentNode.className.includes('recipe__love')||
    e.target.parentNode.parentNode.parentNode.parentNode.className.includes('recipe__love')){ // (likes)
        // likeController
        console.log('likingsss');
        controlLikes();
    }}catch(err){}
    
});
list = new List();
// window.l = new List();  //for console access