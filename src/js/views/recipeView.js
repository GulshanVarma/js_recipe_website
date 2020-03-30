import { elements } from './base';
import {Fraction} from 'fractional' //see usage in documentation on site

export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

// ******** fraction
const formatCount = count =>{
    console.log('in format count = ',count);
    
    if(count){
        //use destructuring
        // those r strings, to parse it in int, so use map
        const [inc,dec] = count.toString().split('.').map(el => parseInt(el,10));
        console.log(inc,dec);
        
        if(!dec || dec === 0) {
            console.log('retuning inc');
            
            return inc;  //2.0
        }
        if(inc === 0){
            console.log('a');
            
            // convert 0.5 to 1/2
            const fr = new Fraction(count);
            console.log('1 out format count');
            return`${fr.numerator}/${fr.denominator}`;
        }else{
            if(dec === 33){     //patch to wrong api data
                return `1 1/3`; 
            }
            console.log('b');
            // 2.5 => 5/2 => 2 1/2
            // count - integer  (2.5-2 => 0.5 => 1/2)
            const fr = new Fraction(count-inc);
            console.log('2 out format count',fr,inc);
            return`${inc} ${fr.numerator}/${fr.denominator}`;
        }
    }else{
        console.log('3 out format count');
        return '?';
    }
}

const createIngredient = ingredient => `
<li class="recipe__item">
<svg class="recipe__icon">
    <use href="img/icons.svg#icon-check"></use>
</svg>
<div class="recipe__count">${formatCount(ingredient.count)}</div>
<div class="recipe__ingredient">
    <span class="recipe__unit">${ingredient.unit}</span>
    ${ingredient.ingredient}
</div>
</li>
`;

export const renderRecipe = (recipe,isLiked) => {
    console.log('in render recipe',recipe,recipe.count,recipe.img,recipe.title,recipe.time,recipe.servings,recipe.author,recipe.url);
    
    
    const markup = `
    <figure class="recipe__fig">
    <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
</figure>

<div class="recipe__details">
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-stopwatch"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <svg class="recipe__info-icon">
            <use href="img/icons.svg#icon-man"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-minus"></use>
                </svg>
            </button>
            <button class="btn-tiny btn-increase">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-plus"></use>
                </svg>
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <svg class="header__likes">
            <use href="img/icons.svg#icon-heart ${isLiked?'':'-outlined'}"></use>
        </svg>
    </button>
</div>

<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createIngredient(el)).join('')}
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
        <svg class="search__icon">
            <use href="img/icons.svg#icon-shopping-cart"></use>
        </svg>
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>`;
console.log('markup loaded');

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// display updated ing after serving event runs
export const updateServingsIngredients = recipe =>{
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;
    // console.log('1');
    const countElem = Array.from(document.querySelectorAll('.recipe__count'));
    // console.log('2');
    countElem.forEach((el,i)=>{
        console.log(el);
        
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
    // console.log('3');
};
