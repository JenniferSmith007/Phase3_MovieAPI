import './style.css'
const apiKey = import.meta.env.VITE_API_KEY;
import { database } from "./movieDatabase";


class Store {
  constructor(init ) {
    const self = this;
    
    this.subscribers = [];
    database.then(async(db) => {
      this.db = db; 
      const movie = await db.get("moviesToStore", "movie")

      if (movie){
        for(const[key,value] of Object.entries(movie))
        this.set(key, value)
      }
    })
    this.state = new Proxy(init, {
     async set(state, key, value) {
        state[key] = value;
        // if(key !== "movie"){
        //   state.movie = state.movie
        // }
        if(self.db){
          console.log(self.db)
    
        
          // for each movie title given back from the call 
          //  place all in the database 

         
          let mainConntitle = document.getElementById("movie_title")
          let mainConnyear = document.getElementById("movie_year")
          let mainConnplot = document.getElementById("movie_plot")
          let mainConnraiting = document.getElementById("movie_raiting")
          let mainConnposter= document.getElementById("movie_poster")
          // console.log('this is movieee array ------' + mainConn)
        //   let movieString = mainConn.toString(); 
        //   console.log(movieString)
        // let movieArray = movieString.split();
        // console.log('this is movieee array ------' + this.movieArray)
      
          await self.db.add("moviesToStore",
          

          {title:mainConntitle.textContent, year: mainConnyear.textContent, plot: mainConnplot.textContent, raiting: mainConnraiting.textContent, poster: mainConnposter.src}),"movie"

          // Array.prototype.forEach.call(mainConn,
          //   console.log(mainConn),
          //   movieTitle => {
          //   console.log(movieTitle)
          // });

          // array.prototype creates an array that will hold all of the elements called on 




          // let moviesTitle = [];
          // mainConn.forEach((movietitle) => {
          //  console.log(movietitle) 
          //  movieTitle.push(movietitle)
          //  console.log(moviesTitle)
          // })
          
            // console.log('this is state----' + mainConn.textContent)
        
        }
        console.log(self.subscribers)
        self.subscribers.forEach((subscriber) => subscriber(state));
        
        console.log('this is the set method')
       
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

    
    let newState = state.movies.push(value)
  
    console.log(value)
    console.log(newState)
    
    this.state = Object.assign(this.state, state)
    
    console.log(this.state)
    
  }

  getAllMovies() {
    return this.state.movies;
  }




}
const store = new Store({ movies:[]});

console.log(store.state.movies)

store.subscribe((state) => {
  console.log(state)
  let movieState = state.movies;
 
  movieState.forEach(subMovies => document.body.appendChild(subMovies))
  
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

    title.textContent = `${searchRes[i].Title}`;
console.log('this is title ---' +title.textContent)
    movieID.textContent = `ID - ${searchRes[i].imdbID}`;
    year.textContent = `YEAR - ${searchRes[i].Year}`;
    plot.textContent = `DESCRIPTION: ${plotData.Plot}`;
    
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
    store.addMovie(store.state, mainCon);
    
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

  // button.style.display = 'none';
  // document.getElementById("movie_search").disabled = true;
  
});






