import "./style.css";
const apiKey = import.meta.env.VITE_API_KEY;
import { database } from "./movieDatabase";



class Store {
  constructor(init) {
    const self = this;

    this.subscribers = [];
    database.then(async (db) => {
      this.db = db;
      const favmovie = await db.get("FavmoviesToStore", "favmovie");
      // const comment = await db.get("comments", "comment")
      console.log('this is favmovieeee', favmovie)
      if (favmovie) {
        for (const [key, value] of Object.entries(favmovie)) this.set(key, value);
     
      }
      console.log('this is favmovieeee', favmovie)
    // if (comment){
    //   for (const [key, value] of Object.entries(comment)) this.set(key, value);
    //   console.log('this is comment',comment)
    // }
    
    });
    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;
     
        if (self.db) {
          console.log(self.db);

         
       
          
          
          
          await self.db.add("FavmoviesToStore", 
          value[value.length - 1] )
          console.log(value[value.length - 1])

          // await self.db.add("comments", 
          // value[value.length - 1] )
          // console.log(value[value.length - 1])
 
       
       
          
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

  addMovie(state, value) {
    let newState = state.movies.push(value);
    

    console.log(value);
    console.log(newState);
   

    this.state = Object.assign(this.state, state);

    console.log(this.state);

    
  }

  getAllMovies() {
    
      

    return this.state.movies
  }

  favMovie(state, value) {
    let favState = state.favmovies.push(value);
    

    console.log(value);
    console.log(favState);
   

    this.state = Object.assign(this.state, state);

    console.log(this.state);
  }

  getAllFavMovies() {
    
      

    return this.state.favmovies
  }
 
  
}
const store = new Store({ movies: [] } );
const favstore = new Store({ favmovies: [] } );




console.log(store)
console.log(favstore)






console.log(store.state.movies);
console.log(favstore.state.favmovies);


store.subscribe((state) => {
  console.log(state);
  let movieState = state.movies;
  console.log('this si movie state', movieState)
  movieState.forEach((subMovies) => document.body.appendChild(subMovies));
  


});

favstore.subscribe((state) => {
  console.log(state);
  let favmovieState = state.favmovies;
  console.log('this si movie state', favmovieState)
  favmovieState.forEach((subFavMovies) => document.body.appendChild(subFavMovies));
 


});

class Movies extends HTMLElement {
  constructor() {
    super();
    this.title = "";
    this.year = "";
    this.plot = "";
    this.comment = "";
    // do I pass in poster and id for the constructor? 
  }
  static get observedAttributes() {
    return ["title", "year", "plot", "comment"];
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


  for (let i = 0; i < searchRes.length; i++) {
    console.log(`this is data: ${searchRes[i].Title}`);

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




    const addComments = (comments) => {
      const transaction = db.transaction("comments", "readwrite")
      transaction.oncomplete = function(e) {
        console.log("all comments added")
      }
      transaction.onerror = function(e){
        console.log('error adding comments ')
      }
      const objectStore = transaction.objectStore("comments")
      for (comment of comments){
        const request = objectStore.add(comment)
        request.onsuccess = () => {
          console.log(`new comment added ${request.result}`)
        }
        request.onsuccess = (err) => {
          console.log('errror addding comments ')
        }
      }
    }
    let notesbtn = document.createElement("button")
    notesbtn.innerHTML = 'Notes'
    movie.appendChild(notesbtn)


    notesbtn.addEventListener("click", (e) => {
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
      
      
        noteres.appendChild(inputvalNode)
        notesDiv.appendChild(noteres)
        noteres.style.border = "solid black "
        noteres.setAttribute("note", inputVal)
        
        // console.log("comments ----->", noteOBJ )
       
          
        console.log('this is notdv--',store)
        
        
        addComments(comments)
        console.log('this is comments--',comments)
      })

      
      movie.appendChild(notesDiv)
    
    })
    store.addMovie(store.state, mainCon);
    
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
        let favoredMoives = []
        favoredMoives.push(favMovies)
        favoredMoives.forEach(favmovie => {
          let favedMovies = []
          favedMovies.push(favmovie)
          console.log(favedMovies)
        })
        
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
      
           
        favstore.favMovie(favstore.state,favMovieObj);
         
    console.log('endddd store',favstore)
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


