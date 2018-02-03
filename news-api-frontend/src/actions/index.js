import axios from 'axios';
import { FETCH_ARTICLES } from './types';

export const fetchArticles = () => {
    return function (dispatch) {
        axios.get('/req/wordcount').then(res => dispatch ({type: FETCH_ARTICLES, payload: res}));
    }
};