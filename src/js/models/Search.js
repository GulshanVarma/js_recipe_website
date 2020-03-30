import axios from 'axios'
import {proxy} from '../config'

export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults() {
        try{
            console.log('getResult()',this.query);
            
            const res = await axios(`${proxy}search?q=${this.query}`);
            this.recipes = res.data.recipes;
            console.log(this.recipes);
            this.result = res.data.recipes;
        }catch(error){
            alert('in search obj');
        }
    }
}