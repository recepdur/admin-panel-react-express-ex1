import axios from 'axios';

export class ProductService {

    getProducts() {
        return axios.get('./products.json').then(res => res.data.data);
    }
}