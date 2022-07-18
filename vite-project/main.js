import './style.css'
const apiKey = import.meta.env.VITE_API_KEY;
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

    imgTag.src = searchRes[i].Poster;
    imgTag.setAttribute("style", "width: 300px");

    title.textContent = `${searchRes[i].Title}`;
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
      
      raiting.style.color='#646cff'
      raiting.style.textAlign='center'
    }
   
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

  button.style.display = 'none';
  document.getElementById("movie_search").disabled = true;
  // getData(plotLen);
});


const movieField = document.querySelector("input");

movieField.addEventListener("input", () => {
  movieField.setCustomValidity("");
  movieField.checkValidity();
  console.log(movieField.checkValidity());
});

movieField.addEventListener("invalid", () => {
  movieField.setCustomValidity("Please fill in your First Name.");
});



