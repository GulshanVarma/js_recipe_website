import uniqid from 'uniqid'; // to generate unique ids

export default class List {
    constructor() {
        this.items = [];        //list array
    }

    //add item ability
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),   
            count,
            unit,
            ingredient
        }
        this.items.push(item);      //now push the created item in the array
        return item;
    }


    // can delete item
    deleteItem(id) {
        // first check if the id exists in list
        const index = this.items.findIndex(el => el.id === id);

        // splice cuts the original array
        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // slice
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        this.items.splice(index, 1);
    }

    // in shopping list +/- buttons can update the count
    updateCount(id, newCount) {
        // find the item in list first
        // update the new count
        // find return element
        this.items.find(el => el.id === id).count = newCount;
        // console.log('new count = ',newCount);
        
    }
}