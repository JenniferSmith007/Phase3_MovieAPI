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

    let ratings = plotData.Ratings;

    for (let i = 0; i < ratings.length; i++) {
      console.log(`${ratings[i].Source} : ${ratings[i].Value}`);
      let maincon2 = document.getElementById("main_con");
      let raiting = document.createElement("p");
      raiting.textContent = `${ratings[i].Source} : ${ratings[i].Value}`;
      maincon2.appendChild(raiting);
    }

    // console.log(Search.Title)
    let mainCon = document.getElementById("main_con");
    // console.log(data.Search[i])

    let imgCont = document.createElement("div");
    let imgTag = document.createElement("img");
    let movieID = document.createElement("p");
    let title = document.createElement("p");
    let year = document.createElement("p");
    let plot = document.createElement("p");

    imgTag.src = searchRes[i].Poster;
    imgTag.setAttribute("style", "width: 500px");

    title.textContent = searchRes[i].Title;
    movieID.textContent = searchRes[i].imdbID;
    year.textContent = searchRes[i].Year;
    plot.textContent = plotData.Plot;

    imgCont.appendChild(imgTag);

    mainCon.appendChild(title);
    mainCon.appendChild(movieID);
    mainCon.appendChild(year);
    mainCon.appendChild(imgCont);
    mainCon.appendChild(plot);
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
  // getData(plotLen);
});
