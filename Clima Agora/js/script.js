const apiKey = "";
const pexelsApiKey = "";

const pexelsApiURL = "https://api.pexels.com/v1/search?query=";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const cityElement = document.querySelector("#city");
const tempElement = document.querySelector("#temperature span");
const descElement = document.querySelector("#description");
const weatherIconElement = document.querySelector("#weather-icon");
const countryElement = document.querySelector("#country");
const humidityElement = document.querySelector("#umidity span");
const windElement = document.querySelector("#wind span");

const weatherContainer = document.querySelector("#weather-data");

const errorMessageContainer = document.querySelector("#error-message");
const loader = document.querySelector("#loader");

const suggestionContainer = document.querySelector("#suggestions");
const suggestionButtons = document.querySelectorAll("#suggestions button");

const clearButton = document.querySelector("#clear-button");




// Mostrar ou esconder o botão de limpar 
cityInput.addEventListener("input", () => {
  if (cityInput.value.trim() !== "") {
    clearButton.style.display = "block";
  } else {
    clearButton.style.display = "none";
  }
});




clearButton.addEventListener("click", () => {
  cityInput.value = "";
  cityInput.focus(); 
  resetApp(); 
});



// Função para voltar ao estado inicial (tá funcionando)
const resetApp = () => {
  setDefaultBackground();
  hideInformation();
  showSuggestions();
};




const setDefaultBackground = () => {
  document.body.style.backgroundImage = "none"; // remove o fundo que tá
  document.body.style.background = "linear-gradient(180deg, rgba(89, 76, 238, 1) 0%, #8dd0f5 100%)";
};




const toggleLoader = () => {
  loader.classList.toggle("hide");
};





const showErrorMessage = () => {
  errorMessageContainer.classList.remove("hide");
  weatherContainer.classList.add("hide");
};





const hideInformation = () => {
  errorMessageContainer.classList.add("hide");
  weatherContainer.classList.add("hide");
  suggestionContainer.classList.add("hide");
};




const showSuggestions = () => {
  suggestionContainer.classList.remove("hide");
};





const getPexelsImage = async (city) => {
  if (!city) return;

  try {
    const res = await fetch(`${pexelsApiURL}${city}&per_page=1`, {
      headers: {
        Authorization: pexelsApiKey,
      },
    });

    if (!res.ok) throw new Error("Erro ao buscar imagem da cidade");

    const data = await res.json();

    if (data.photos.length > 0) {
      const imageUrl = data.photos[0].src.large;
      document.body.style.backgroundImage = `url("${imageUrl}")`;
      document.body.style.backgroundSize = "cover"; // Ajusta o tamanho da imagem para cobrir o fundo
      document.body.style.backgroundRepeat = "no-repeat"; // Não repete a imagem
      document.body.style.backgroundPosition = "center"; // Centraliza a imagem
    } else {
      console.warn("Nenhuma imagem encontrada para a cidade. Usando imagem padrão.");
      setDefaultBackground();
    }
  } catch (error) {
    console.error("Erro ao buscar imagem no Pexels:", error);
    setDefaultBackground();
  }
};




const getWeatherData = async (city) => {
  toggleLoader();


  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`;


  try {
    const res = await fetch(apiWeatherURL);
    if (!res.ok) throw new Error("Cidade não encontrada");
    const data = await res.json();
    return data;
  } catch (error) {
    showErrorMessage();
  } finally {
    toggleLoader();
  }
};





const showWeatherData = async (city) => {
  hideInformation();

  if (!city) {
    showSuggestions();
    setDefaultBackground();
    return;
  }

  const data = await getWeatherData(city);

  if (!data) return;

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`);

  const country = data.sys.country;
  countryElement.setAttribute("src", `https://flagsapi.com/${country}/flat/64.png`);

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  await getPexelsImage(city);

  weatherContainer.classList.remove("hide");
};


searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const city = cityInput.value.trim();
  if (!city) {
    resetApp(); 
  } else {
    showWeatherData(city);
  }
});


cityInput.addEventListener("keyup", (e) => {
  if (e.code === "Enter") {
    const city = e.target.value.trim(); 

    showWeatherData(city);
  }
});


suggestionButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const city = btn.getAttribute("id");

    showWeatherData(city);
  });
});



setDefaultBackground();
