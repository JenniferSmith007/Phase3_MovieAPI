import { openDB } from 'idb';
const apiKey = import.meta.env.VITE_API_KEY;

export const database =  openDB('MovieStore', 2, {
    upgrade(db) {
     db.createObjectStore('moviesToStore',    {keyPath:"id",
     
       autoIncrement: true });

       db.createObjectStore('FavmoviesToStore',    {keyPath:"fav",
     
       autoIncrement: true });
      
      
    },
  });


  
  