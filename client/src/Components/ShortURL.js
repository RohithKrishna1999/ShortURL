import React from 'react'
import { shortURL } from '../Services/ShortURLServices';

export default function ShortURL() {
    function handleFormSubmit(event) {
        event.preventDefault();
        const longUrlInput = document.getElementById('longUrlInput');
        const longUrl = longUrlInput.value.trim();

        // Validate the URL
        if (!isValidUrl(longUrl)) {
            alert('Please enter a valid URL.');
            return;
        }

        // Send a request to the server to shorten the URL
        shortenUrl(longUrl);
    }
    function handleURLCheck(event){
        // Send a GET request to your server with the shortUrl
        const shortUrlLink = document.getElementById('shortUrlLink');

        // Using Service call
        shortURLCheck(shortUrlLink.href).then((response)=>{
            window.open(shortUrlLink.href,"_blank")
        }).catch((error) => {
            // Error
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response !== undefined && error.response.status !== undefined && error.response.status === 404) {
                    window.alert(error.message)
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the 
                // browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

    // Function to validate the URL
    function isValidUrl(url) {
        return url.startsWith('http://') || url.startsWith('https://');
    }

    // Function to send a request to the server to shorten the URL
    function shortenUrl(longUrl) {
        // Send a POST request to your server with the longUrl

        // Using Service call
        shortURL(longUrl).then((response)=>{
            const shortUrlLink = document.getElementById('shortUrlLink');
            shortUrlLink.href = response.shortUrl;
            shortUrlLink.textContent = response.shortUrl;
            document.getElementById('shortUrlContainer').style.display = 'block';
        })
    }
    return (
        <div>
            <h1>URL Shortener</h1>
            <form id="urlForm">
                <input type="text" id="longUrlInput" placeholder="Enter URL" required />
                <button type="submit" onClick={(e)=>handleFormSubmit(e)}>Shorten</button>
            </form>
            <div id="shortUrlContainer">
                <p>Short URL: <a id="shortUrlLink" target="_blank" onClick={(e)=>handleURLCheck(e)}></a></p>
            </div>
        </div>
    )
}
