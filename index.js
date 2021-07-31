// -- VARIABLES --

const form = document.querySelector("form");
const input = document.querySelector("input");
const apiKey = "fabdfa6cd0ad87ac4287275cb1c57944";
//const test = document.querySelector("#test");
const msg = document.querySelector(".msg");
const list = document.querySelector(".cities");
const msgContainer = document.querySelector(".msg-container")

form.addEventListener("submit", e => {
  e.preventDefault();
  let inputVal = input.value;

  //Prevent Repeat Cities
  const listItems = list.querySelectorAll(".ajax-section .city");
  const listItemsArray = Array.from(listItems);

  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter(el => {
      let content = "";
      //athens, GR
      if (inputVal.includes(",")) {
        //athens, GRRRRRR -> invalid country code, so we keep only the first
        //part of the inputVal
        if (inputVal.split(",")[1].length > 2) {
          inputVal = inputVal.split(",")[0];
          content = el.querySelector(".city-name span").textContent.toLowerCase();
        } else {
          content = el.querySelector(".city-name").dataset.name.toLowerCase();
        }
      } else {
        //athens
        content = el.querySelector(".city-name span").textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msgContainer.classList.remove("noDisplay");
      msg.textContent = `You already know the weather for ${filteredArray[0].querySelector('.city-name span').textContent}... if you are looking for a city with the same name, be more specific by providing the country code as well.`;
      form.reset();
      input.focus();
      return;
    }
  }

  //-- API FETCH REQUEST -- 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;
  //test.innerHTML = inputVal;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      //Gather city data and assign to variables
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]
        }@2x.png`;
      const li = document.createElement("LI");
      const markup = `
            <div class="row">
              <div class="col-8 col-sm-12" style="background-color:whitesmoke">
                <h2 class="city-name" data-name="${name},${sys.country}">
                  <span>${name}</span>
                  <sup>${sys.country}</sup>
                </h2>
                <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup></div>
              </div>
              <div class="col-4 col-sm-12 figure-container" style="background-color:lightpink">
                <figure>
                  <img class="city-icon" src=${icon} alt="${weather[0]['main']}"/>
                  <figcaption>${weather[0]['description']}</figcaption>
                </figure>
              </div>
            </div>
          `;
      /*
        <div class="row">
            <div class="col-8 col-sm-12">
              <div class='city-name'>
                <span>New York, New York</span> <sup>US</sup>
              </div>
              <div class='city-temp'>
                77<sup>F</sup>
              </div>
            </div>
            <div class="col-4 col-sm-12">
              <figure>
                <img src="img-placeholder.svg" width="50px" height="auto" alt="">
                <figcaption>
                  Slightly Cloudy
                </figcaption>
              </figure>
            </div>
          </div>
      */

      //Append city to end of list
      li.classList.add("city");
      li.innerHTML = markup;
      list.appendChild(li);

      //Clear form data; empty values
      msg.textContent = "";
      form.reset();
      input.focus();
    })
    .catch(() => {
      msgContainer.classList.remove("noDisplay");
      msg.textContent = "Please search for a valid city.";
    })
  msgContainer.classList.add("noDisplay");
});