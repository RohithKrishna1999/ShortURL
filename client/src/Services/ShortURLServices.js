import axios from "axios";


//Creating an axio interceptor
const Interceptor = axios.create({
    baseURL:"http://localhost:8080/"
});

export function shortURL(longUrl) {
    let  body={
        URL:JSON.stringify({ longUrl })
    } 
    return Interceptor.post(`api/shorten`,{headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
    },body});
}
export function shortURLCheck(longUrl) {
    return Interceptor.get(`api/shortUrl=${longUrl}`,{headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'*'
    }});
}

