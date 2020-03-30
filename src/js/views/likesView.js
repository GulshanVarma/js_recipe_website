import { elements } from './base';
import { limitRecipeTitle } from './searchView';

export const toggleLikeBtn = isLiked => {
    // icon toggle function 
    console.log('recieved === ',isLiked);
    
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    // removing css from html **************SETATTRIBUTE
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    // icons.svg#icon-heart-outlined
};

export const toggleLikeMenu = numLikes => {
    // if we should show the like menu or not
    // manipulate the *************visibility ******************************
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
    console.log('toggling menu');
    
};

export const renderLike = like => {
    // creating list in like list
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    console.log('in delete like ,' ,document.querySelector(`.likes__link[href*="${id}"]`).parentElement);
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
    toggleLikeMenu(likes.getNumLikes()); 
}