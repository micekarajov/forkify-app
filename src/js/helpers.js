import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';


//* timeout function so that it can't run forever.
const timeout = function (s) {
    return new Promise(function (_, reject) {
       setTimeout(function () {
           reject(new Error(`Request took too long! Timeout after ${s} second`));
       }, s * 1000);
   });
};


export const AJAX = async function(url, uploadData = undefined) {
    try {
        const fetchPro = uploadData 
        ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' //data that we're gonna send is going to be in the JSON format.
            },
            body: JSON.stringify(uploadData),
        }) : fetch(url);

        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await response.json();
    
        if(!response.ok) throw new Error(`${data.message} (${response.status})`);
        return data;

    } catch (error) {
        throw error;
    }
    
}


/*
export const getJSON = async function(url) {
    try {
        const fetchPro =  fetch(url);
        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await response.json();
    
        if(!response.ok) throw new Error(`${data.message} (${response.status})`);
        return data;
    } catch(error) {
        throw error;
    }
};

export const sendJSON = async function(url, uploadData) {
    try {
        const fetchPro =  fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' //data that we're gonna send is going to be in the JSON format.
            },
            body: JSON.stringify(uploadData),
        });
        const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const data = await response.json(); // return the data back that we send...
    
        if(!response.ok) throw new Error(`${data.message} (${response.status})`);
        return data;
    } catch(error) {
        throw error;
    }
};
*/
