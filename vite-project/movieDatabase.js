import { openDB } from 'idb';


export const database =  openDB('MovieStore', 2, {
  
    upgrade(db) {
     
  
     db.createObjectStore('FavmoviesToStore')

     
    
    
     
      
    },
    
  });



  