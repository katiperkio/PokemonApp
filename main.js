const content = document.querySelector(".cardWrapper");
const amount = document.querySelector(".pokeAmount");
let pokeData = [];
let genSelected = false;
if (!genSelected) {
  content.innerHTML = '<p class="plsSelectGen">Select a generation first.</p>';
}

const fetchData = async (limit, offset) => {
  await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
  )
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url)
          .then((response) => response.json())
          .then((data) => {
            const types = data.types.map((type) => type.type.name);
            const heightMeters = (data.height / 10).toFixed(1);
            const weightKilograms = (data.weight / 10).toFixed(1);
            return {
              id: data.id,
              name: data.name,
              img:
                data.sprites.other["official-artwork"].front_default ??
                "https://cdn.pixabay.com/photo/2017/10/16/21/51/rejected-2858656_1280.png",
              types: types,
              heightMeters: heightMeters,
              weightKilograms: weightKilograms,
            };
          });
      });
      Promise.all(fetches).then((response) => {
        pokeData = response;
        pokeCards();
        pokeCount();
        genSelected = true;
        console.log(pokeData);
      });
    });
};

const searchInput = document.getElementById("searchBar");

searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();

  if (genSelected) {
    const filteredPokeData = pokeData.filter((pokemon) => {
      return (
        pokemon.name.includes(searchTerm) ||
        pokemon.id.toString().includes(searchTerm) ||
        pokemon.types.some((type) => type.includes(searchTerm)) ||
        pokemon.heightMeters.includes(searchTerm) ||
        pokemon.weightKilograms.includes(searchTerm)
      );
    });

    pokeCards(filteredPokeData);
  }
});

const pokeCards = (data = pokeData) => {
  const cards = data
    .map((pokemon) => {
      return `<div class="pokeCard">
      <p class="id">#${pokemon.id}</p>
      <div class="pokeImg">
        <img src="${pokemon.img}" />
      </div>
      <div class="pokeName">${pokemon.name}</div>
      <div class="pokeType">
        ${pokemon.types
          .map(
            (type) => `
        <p class="type-badge type-${type}">${type}</p>
        `
          )
          .join("")}
      </div>
      <div class="pokeHeightWeight">
        <p class="pokeHeight">${pokemon.heightMeters}m</p>
        <p class="pokeWeight">${pokemon.weightKilograms}kg</p>
      </div>
    </div>`;
    })
    .join("");

  content.innerHTML = cards;
  return data.length;
};

const pokeCount = () => {
  const cardCount = pokeCards();
  amount.innerHTML = `<p class="pokeAmount">The amount of Pokemon in this generation is ${cardCount}</p>`;
};
