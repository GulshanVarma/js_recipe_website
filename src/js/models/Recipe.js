// const res = await axios(`${proxy}get?rId=${this.id}`);
import axios from 'axios';
import { proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch (error) {
            alert('recipe.js,Something went wrong :(');
        }
    }

    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServing() {
        this.servings = 4;
    }

    parseIngredients() {
        let newIngredients;
        console.log('in parse ingredients');
        let count = 0;
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        console.log(this);
try{
        newIngredients = this.ingredients.map(el => {
            // 1) Uniform units
            console.log('1');
            
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses
            console.log('2');
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient
            console.log('3');
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));
            let objIng;
            if (unitIndex > -1) {
                console.log('4');
                // There is a unit
                // Ex. 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex);
                // arrcount verified
                let count = 0.00;
                if (arrCount.length === 1) {
                    if(arrCount[0] == ""){
                        console.log('ccccccccc');
                        count = 1;
                    }else{
                        console.log('aaaaaaa = ',arrIng[0].replace('-', '+'));
                        count = eval(arrIng[0].replace('-', '+'));
                    }
                } else {
                    console.log('bbbbbbbbb = ',arrIng.slice(0, unitIndex).join('+'));
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                console.log(arrIng);
                
                console.log('5');
                console.log('c = ',count);
                count = count.toFixed(2);
                console.log('5.1');
                
                console.log('c = ',count);
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };
                console.log('6');
                
            } else if (parseInt(arrIng[0], 10)) {
                console.log('7');
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                console.log('8');
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            console.log('9');
            return objIng;
        });
    }catch(error){
        alert(error.stack);
    }
        console.log('ans = ', newIngredients);
        this.ingredients = newIngredients;
        
        console.log('in parse ingredients ***',this.ingredients);
        
        // this.ingredients = newIngredients;
    }


    // update the servings
    updateServings(type){
    //    servings 
    console.log('in serving, ',type);
    
    const newServings = type === 'dec' ? this.servings -1 : this.servings + 1;

    // ingredients number updation acc. to the servings
    this.ingredients.forEach(ing =>{
        ing.count = ing.count * (newServings / this.servings);        
    })

    // save the ingredients
    this.servings = newServings;
    }
}