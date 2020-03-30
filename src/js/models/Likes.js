export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        // add data in class object
        const like = { id, title, author, img };
        if(!this.isLiked(id))
            this.likes.push(like);

        // Perist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        //just like list
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        // Perist data in localStorage
        this.persistData();
    }

    isLiked(id) {//check like 
        // -1 for not found
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    // localStorage use key value pair ************************
    // can use only strings
    // used by webpack also

    persistData() {
        // convert the array to string, localstorage rule*******************
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        // convert the string to array ************************************
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}
