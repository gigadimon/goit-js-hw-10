import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');

const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfoContainer: document.querySelector('.country-info'),
  countryInput: document.querySelector('#search-box'),
};
const DEBOUNCE_DELAY = 300;

refs.countryInput.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  const normilizedCountryName = e.target.value.trim();
  if (!normilizedCountryName) {
    resetContent();
    return;
  }
  fetchCountries(normilizedCountryName)
    .then(countries => {
      if (countries?.length < 2) {
        renderCountryInfo(countries);
        return;
      } else if (countries?.length >= 2 && countries?.length <= 10) {
        renderCountriesList(countries);
        return;
      } else if (countries?.length > 10) {
        /* здесь через else if, тк без него увед срабатывает и при ошибке */ Notify.info(
          'Too many matches found. Please enter a more specific name.',
        );
      }
    })
    .catch(resetContent());
}

function renderCountriesList(countries) {
  resetCountryInfo();

  refs.countryList.innerHTML = countries
    .map(
      country =>
        `<li class="country-item"><img width="30px" height="20px" src="${country.flags.svg}">${country.name.official}</img></li>`,
    )
    .join('');
}

function renderCountryInfo(countries) {
  resetCountriesList();

  refs.countryInfoContainer.innerHTML = countries.map(country => {
    return `<div class="country-info__container"><div class="country-header"><img class="flag" width="100%" src="${
      country.flags.svg
    }" alt="Имя страны" />
      <h2 class="country-info__name">${country.name.official}</h2></div>
      <div class="country-info__text"><ul class="properties">
      <li class="properties__item"><p><span class="property">Capital:</span>${
        country.capital
      }</p></li>
      <li class="properties__item"><p><span class="property">Population:</span>${
        country.population
      }</p></li>
      <li class="properties__item"><p><span class="property">Languages:</span>${Object.values(
        country.languages,
      )}</p></li>
      </ul></div>
      </div>`;
  });
}

function resetContent() {
  resetCountriesList();
  resetCountryInfo();
}

function resetCountriesList() {
  refs.countryList.innerHTML = '';
}

function resetCountryInfo() {
  refs.countryInfoContainer.innerHTML = '';
}
