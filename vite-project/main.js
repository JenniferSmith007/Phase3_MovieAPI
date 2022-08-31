import "./style.css";
const apiKey = import.meta.env.VITE_API_KEY;
import { database } from "./movieDatabase";



class Store {
  constructor(init) {
    const self = this;

    this.subscribers = [];
    database.then(async (db) => {
      this.db = db;
      console.log(this.db)
      const favorites = await db.get("FavmoviesToStore", "favorites");
      const comments = await db.get("comments", "comments");
      if (favorites) {
        console.log(favorites)
        for (const [key, value] of Object.entries(favorites)) this.set(key, value);
     
      }
      if (comments) {
        console.log(comments)
        for (const [key, value] of Object.entries(comments)) this.set(key, value);
     
      }
    });
    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;

    //  key = legit string "search", "movies"
        if (self.db) {
          console.log(self.db);

        //  key =["comments", "favorites"]
       
          // console.log(db.key)
          // console.log(state[key])
          // check to see what the key is with a conditional  , only time to add to db is if key favorites is true if key === 'Favorites" 
           
              
              // await self.db.add("FavmoviesToStore", 
              // value[value.length - 1] )
              // console.log(value[value.length - 1])
          
            
            // if (key === "comments"){
            //   console.log(key)
            //   await self.db.add("comments", 
            //   value[value.length - 1] )
            //   console.log(value[value.length - 1])
            // }
          

          
          
          

       
       
          
        }
        console.log(self.subscribers);
        self.subscribers.forEach((subscriber) => subscriber(state));

        
      },
    });
  }
  subscribe(cb) {
    if (typeof cb !== "function") {
      throw new Error("You must subscribe with a function");
    }
    this.subscribers.push(cb);
  }

  addMovieState(state, value) {



  state.movies.push(value)

   
 
    

    
   
    
   

    this.state = Object.assign(this.state, state);

    console.log(this.state);
}
addFavoriteState(state, value) {



  state.favorites.push(value)

  

   

   
  
   
  

   this.state = Object.assign(this.state, state);

   console.log(this.state);
}
addSearchState(state, value) {


  state.search.push(value)
  // state.search.concat(value)
console.log(state.search)
  console.log(value)

   

   
  
   
  

   this.state = Object.assign(this.state, state);

   console.log(this.state);
}


  getMovieState() {
    
      
   
    return this.state.movies
  
  }

  getFavoriteState() {
    
      
   
    return this.state.favorites
  
  }

  getSearchState() {
    
      
   
    return this.state.search
  
  }



//  can combine into 1 set and get method 
// another similar set and get for key and search 
// set key  this.state(key,value){
  // this.state[key] =value 

// }
// get key 
  
}
const store = new Store({ search: [], key: '', favorites: [], movies: [] } );
        // this.state = {"api" "search"}
// const favstore = new Store({ favmovies: [] } );



console.log(store.state.search)
console.log(store.state.favorites)
console.log(store.state.movies)
console.log(store.state.comments)








// console.log(favstore.state.favmovies);


store.subscribe((state) => {
  console.log(state);
  let movieState = state.movies;
  console.log('this si movie state', movieState)
  movieState.forEach((subMovies) => document.body.appendChild(subMovies));
  


});

store.subscribe((state) => {
  console.log(state);
  let favmovieState = state.favorites;
  console.log('this si movie state', favmovieState)
  favmovieState.forEach((subFavMovies) => document.body.appendChild(subFavMovies));
  console.log('this si movie state', subFavMovies)


});
store.subscribe((state) => {
  console.log(state);
  let searchState = state.search;
  console.log('this sisearch state', searchState)
  searchState.forEach((subsearchMovies) => document.body.appendChild(subsearchMovies));
  console.log('this si movie state', subsearchMovies)


});

class Movies extends HTMLElement {
  constructor() {
    super();
    this.title = "";
    this.year = "";
    this.plot = "";
    
    // do I pass in poster and id for the constructor? 
  }
  static get observedAttributes() {
    return ["title", "year", "plot"];
    // same as above? 
  }
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }


}

window.customElements.define("movie-component", Movies);

async function getData(inputVal, plotLen) {
 
  const resp = await fetch(
    `https://www.omdbapi.com/?s=${inputVal}&plot=short&apikey=${apiKey}`
  );
  const data = await resp.json();
  console.log(data);
  let searchRes = data.Search;
  console.log(searchRes);
  console.log(`this is your pltLen: ${plotLen}`);
  store.addSearchState(store.state, inputVal);

  for (let i = 0; i < searchRes.length; i++) {
    console.log(`this is data: ${searchRes[i].Title}`);
  // store.set("search" ,  ${searchRes[i].Title})
    const plotUrl = `https://www.omdbapi.com/?t=${searchRes[i].Title}&plot=${plotLen}&apikey=${apiKey}`;
    console.log(`this is your plotURl ${plotUrl}`);
    const plotResp = await fetch(`${plotUrl}`);
    const plotData = await plotResp.json();
    console.log(plotData.Plot);
    console.log(plotData.Ratings);

   
 
    // console.log(Search.Title)
    let mainCon = document.getElementById("movie");
    // console.log(data.Search[i])
    let movie = document.createElement('div')
    movie.setAttribute("id", "mov")
    let imgCont = document.createElement("div");
    let imgTag = document.createElement("img");
    let movieID = document.createElement("p");
    let title = document.createElement("p");
    let year = document.createElement("p");
    let plot = document.createElement("p");







   
    
    
    
    
   
    
    
    
    
    
    imgTag.src = searchRes[i].Poster;
    imgTag.setAttribute("style", "width: 300px");
    // how can i use the style in a different file but still use SearchRes value? 
    //  or how can i style the data from the api call? 

    title.textContent = `${searchRes[i].Title}`;
    movieID.textContent = `ID - ${searchRes[i].imdbID}`;
    year.textContent = `YEAR - ${searchRes[i].Year}`;
    plot.textContent = `DESCRIPTION: ${plotData.Plot}`;
    plot.setAttribute("id", "plotp")
    
    imgCont.appendChild(imgTag);
    mainCon.appendChild(movie)
    movie.appendChild(title);
    movie.appendChild(movieID);
    movie.appendChild(year);
   movie.appendChild(imgCont);
    movie.appendChild(plot);
    
    console.log('this is movie', movie)
    title.style.textAlign='center'
    title.style.fontSize='2em'

    movieID.style.textAlign='center'
   
   
   year.style.textAlign='center'
   imgCont.style.textAlign='center'

    let ratings = plotData.Ratings;

    for (let i = 0; i < ratings.length; i++) {
      console.log(`${ratings[i].Source} : ${ratings[i].Value}`);
      // let maincon2 = document.getElementById("movie");
      let raiting = document.createElement("p");
      raiting.textContent = `RATING: ${ratings[i].Source} : ${ratings[i].Value}`;
      movie.appendChild(raiting);
      
      raiting.style.color='#646cff'
      raiting.style.textAlign='center'
    }




    
    let notesbtn = document.createElement("button")
    notesbtn.innerHTML = 'Notes'
    movie.appendChild(notesbtn)


    notesbtn.addEventListener("click", (e) => {
      // async callback 
      let notesDiv = document.createElement("div")
      let noteInput = document.createElement("textarea")
      noteInput.setAttribute("rows", "10")
      noteInput.setAttribute("cols", "30")
      noteInput.setAttribute("id", "notesval")
      let addNote = document.createElement("button")
      addNote.innerText = 'Add A Note.'
      notesDiv.appendChild(noteInput)
      notesDiv.appendChild(addNote)
      notesDiv.setAttribute("id", "notess")
      
      addNote.addEventListener("click", (e) => {
        e.preventDefault()
        let inputVal = document.getElementById("notesval").value
        console.log(inputVal)
        let noteres = document.createElement("p")
        let inputvalNode = document.createTextNode(inputVal)
        let comments = {
          imdbID: `${searchRes[i].imdbID}`, 
          notes: `${inputVal}`
        }
        console.log(comments)
       store.db.add("comments", comments)
       let seeNotes = document.createElement('button')
       noteres.appendChild(seeNotes)
          seeNotes.innerText = 'see notes'

       seeNotes.addEventListener("click", async() => {
        let resp = document.createElement("p")
        noteres.appendChild(resp)
        let req = store.db.getAll("comments")
        let reqAns = document.createTextNode(req)
        console.log(req)
         
       
        resp.appendChild(reqAns)

   
       })
     
       
        
       
    
      // let allcom = document.createTextNode(req)
      // notesDiv.innerText = `this is result ${allcom}`
      // // allcom.innerText = `this is res ${allcom}`
        noteres.appendChild(inputvalNode)
        notesDiv.appendChild(noteres)
        noteres.style.border = "solid black "
        noteres.setAttribute("note", inputVal)
        
        // console.log("comments ----->", noteOBJ )
       
          
        console.log('this is notdv--',store)
        
        
   


          // create view and hide notes to add listeners to show or hide comments 

          


        console.log('this is comments--',comments)
      })

   
      movie.appendChild(notesDiv)
    
    })
   
    store.addMovieState(store.state, mainCon);
   
    
    console.log('endddd store',store)
    
    
    
    

    
    
    
    
    
    
    
    
  













   
    




    let favButton = document.createElement("button")
    console.log(favButton)
    favButton.setAttribute("id", "favbtn")
    favButton.textContent = "Favorite <3"
    movie.appendChild(favButton)
   
   
    favButton.addEventListener("click", (e) => {
      e.preventDefault(); 
     let favMovieDisplay = document.createElement("div")
     
      let favMovies = document.createElement("div")
     favMovies.setAttribute("id", "favedmov")
      favMovieDisplay.setAttribute("id", "favmov")
     

      let favTitle = document.createTextNode(searchRes[i].Title)
        let favYear = document.createTextNode(searchRes[i].Year)
        let favPlot = document.createTextNode(plotData.Plot)
        // let favinputVal = document.getElementById("notesval").value
        // console.log(favinputVal)
        // let favNoteres = document.createElement("p")
       
        // favNoteres.appendChild(favinputVal)
      
        
        
        let favMovieID = document.createTextNode(searchRes[i].imdbID)
        let favPoster = document.createElement('img')
        favPoster.src = searchRes[i].Poster 
        
        
        favMovieDisplay.appendChild(favMovies)
        favMovies.appendChild(favTitle)
        favMovies.appendChild(favYear)
        favMovies.appendChild(favPoster)
        favMovies.appendChild(favPoster)
        favMovies.appendChild(favMovieID)
        favMovies.appendChild(favPlot)
        // favMovies.appendChild(favNoteres)
        // favMovieContainer.appendChild(favraiting)
        document.body.appendChild(favMovieDisplay)
        console.log(favMovieDisplay)
        // let favoredMoives = []
        // favoredMoives.push(favMovies)
        // favoredMoives.forEach(favmovie => {
        //   let favedMovies = []
        //   favedMovies.push(favmovie)
        //   console.log(favedMovies)
        // })
        
        // favedMovies.push(favMovies)
        // console.log(favedMovies)
      
        let favMovieObj = {
          title: `${searchRes[i].Title}`,
          year: `${searchRes[i].Year}`,
          Poster: `${searchRes[i].Poster}`,
          
          Plot: `${plotData.Plot}`,
          
          imdbID: `${searchRes[i].imdbID}`, 
          // notes: `${favinputVal}`
          
        }
        console.log(favMovieObj)
        console.log(favMovieObj.imdbID)
      
        
       store.addFavoriteState(store.state,favMovieObj);
       store.db.add("FavmoviesToStore", favMovieObj)
   
       
       let favdiv = document.createElement('p')
       document.body.appendChild(favdiv)

       console.log('endddd store',favMovieObj) 
    console.log('endddd store',store)
    })




   
   
    
    



  }
}


const button = document.getElementById("button");
button.addEventListener("click", function (e) {
  e.preventDefault();
  const inputVal = document.getElementById("movie_search").value;

  
  const plot = document.querySelector(
    "input[type=radio][name=plot_length]:checked"
  );
  const plotLen = plot.value;
  console.log(`this is plot lenth 3: ${plotLen}`);
  getData(inputVal, plotLen);

 
});


