document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-bar input");
    const searchButton = document.querySelector(".search-bar button");
    const clearButton = document.createElement("button");
    clearButton.textContent = "Clear";
    clearButton.addEventListener("click", () => {
        document.querySelector(".recommendations-container").innerHTML = "";
        searchInput.value = "";
    });
    document.querySelector(".search-bar").appendChild(clearButton);

    fetch("travel_recommendation_api.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            console.log("Fetched data:", data);
            searchButton.addEventListener("click", () => {
                const keyword = searchInput.value.toLowerCase().trim();
                if (keyword) {
                    displayRecommendations(data, keyword);
                }
            });
        })
        .catch(error => {
            console.error("Error fetching recommendations:", error);
        });
});

function displayRecommendations(data, keyword) {
    const resultsContainer = document.querySelector(".recommendations-container") || document.createElement("div");
    resultsContainer.innerHTML = "";
    resultsContainer.classList.add("recommendations-container");
    document.body.appendChild(resultsContainer);

    let filteredRecommendations = [];

    Object.keys(data).forEach(category => {
        data[category].forEach(item => {
            if (item.name.toLowerCase().includes(keyword)) {
                filteredRecommendations.push(item);
            }
            if (category === "countries" && item.cities) {
                item.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(keyword)) {
                        filteredRecommendations.push(city);
                    }
                });
            }
            if (category === "beaches" && item.beach) {
                if (item.beach.toLowerCase().includes(keyword)) {
                    filteredRecommendations.push(item);
                }
            }
        });
    });

    if (filteredRecommendations.length === 0) {
        resultsContainer.innerHTML = "<p>No recommendations found.</p>";
        return;
    }

    filteredRecommendations.forEach(recommendation => {
        const card = document.createElement("div");
        card.classList.add("recommendation-card");

        const image = document.createElement("img");
        image.src = recommendation.imageUrl;
        image.alt = recommendation.name;

        const name = document.createElement("h3");
        name.textContent = recommendation.name;

        const description = document.createElement("p");
        description.textContent = recommendation.description;

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(description);
        resultsContainer.appendChild(card);
    });
}
