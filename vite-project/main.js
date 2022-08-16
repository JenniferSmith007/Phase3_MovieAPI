import "./style.css";
const apiKey = import.meta.env.VITE_API_KEY;
import { database } from "./movieDatabase";


class Store {
  constructor(init) {
    const self = this;

    this.subscribers = [];
    database.then(async (db) => {
      this.db = db;
      const movie = await db.get("moviesToStore", "movie");

      if (movie) {
        for (const [key, value] of Object.entries(movie)) this.set(key, value);
      }
    });
    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;
     
        if (self.db) {
          console.log(self.db);

       

          await self.db.add("moviesToStore", 
          value[value.length - 1])
         
          
        }
        console.log(self.subscribers);
        self.subscribers.forEach((subscriber) => subscriber(state));

        console.log("this is the set method");
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
    return this.state.movies;
  }
  addFavMovie(state, value) {
    let newFavState = state.favMovies.push(value);

   
    console.log(value);
    console.log(newFavState);

    console.log(this.state.favMovies);

    this.state = Object.assign(this.state, state);

    console.log(this.state);
  }
  getAllFavMovies() {
    return this.state.favMovies;
  }
}
const store = new Store({ movies: [] });
const favstore = new Store({ favMovies: [] });
console.log(favstore);
console.log(store.state.movies);

store.subscribe((state) => {
  console.log(state);
  let movieState = state.movies;
  console.log('this si movie sta e', movieState)
  movieState.forEach((subMovies) => document.body.appendChild(subMovies));
 
  let favMovieState = state.favMovies;
  favMovieState.forEach((subFavMovies) =>
    document.body.appendChild(subFavMovies)
  );

});

class Movies extends HTMLElement {
  constructor() {
    super();
    this.title = "";
    this.year = "";
    this.plot = "";
  }
  static get observedAttributes() {
    return ["title", "year", "plot"];
  }
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[attributeName] = newValue;
  }

}

window.customElements.define("movie-component", Movies);



 export async function getData(inputVal, plotLen) {
  const resp = await fetch(
    `https://www.omdbapi.com/?s=${inputVal}&plot=short&apikey=${apiKey}`
  );
  const data = await resp.json();
  console.log(data);
  let searchRes = data.Search;
  console.log(searchRes);

  for (let i = 0; i < searchRes.length; i++) {
    const plotUrl = `https://www.omdbapi.com/?t=${searchRes[i].Title}&plot=${plotLen}&apikey=${apiKey}`;

    const plotResp = await fetch(`${plotUrl}`);
    const plotData = await plotResp.json();
  
  console.log(plotData)
    
    let raitingData = plotData.Ratings
    let movieObject = {
      Title: searchRes[i].Title,
      Year: searchRes[i].Year,
      Plot: plotData.Plot,
      Poster: searchRes[i].Poster,
      Rating:raitingData
    };

   let mainCon = document.getElementById("movie");
      let movie = document.createElement('div')
      let imgCont = document.createElement("div");
      let imgTag = document.createElement("img");
      let movieID = document.createElement("p");
      let title = document.createElement("p");
      let year = document.createElement("p");
      let plot = document.createElement("p");
      title.setAttribute('id', "movie_title")
      year.setAttribute('id', "movie_year")
      plot.setAttribute('id', "movie_plot")
      imgTag.src = searchRes[i].Poster;
      imgTag.setAttribute("style", "width: 300px");
      imgTag.setAttribute("id","movie_poster");
      
      title.textContent = `${movieObject.Title}`;
      
      movieID.textContent = `ID - ${movieObject.imdbID}`;
      year.textContent = `YEAR - ${movieObject.Year}`;
      plot.textContent = `DESCRIPTION: ${movieObject.Plot}`;
      
      imgCont.appendChild(imgTag);
      mainCon.appendChild(movie)
      movie.appendChild(title);
      movie.appendChild(movieID);
      movie.appendChild(year);
      movie.appendChild(imgCont);
      movie.appendChild(plot);
      
      title.style.textAlign='center'
      title.style.fontSize='2em'
      
      movieID.style.textAlign='center'
      
      
      year.style.textAlign='center'
      imgCont.style.textAlign='center'
      
      let ratings = plotData.Ratings;
      
      for (let i = 0; i < ratings.length; i++) {
        console.log(`${ratings[i].Source} : ${ratings[i].Value}`);
        let maincon2 = document.getElementById("movie");
        let raiting = document.createElement("p");
        raiting.textContent = `RATING: ${ratings[i].Source} : ${ratings[i].Value}`;
        maincon2.appendChild(raiting);
        raiting.setAttribute("id", "movie_raiting")
        raiting.style.color='#646cff'
        raiting.style.textAlign='center'
      }


    
    





    console.log("this is movie obj --", movieObject);
    store.addMovie(store.state, movieObject );
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
  getData(inputVal, plotLen)
  console.log('this is datttttaaaa', {getData})

    


});


