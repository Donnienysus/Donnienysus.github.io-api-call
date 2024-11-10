const accessKey = '95eUE1q6dz5MyXIrAOJXdoWzPJ7otN5PPVwnFfGqPFE';
const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search-input');
const searchBtn = document.getElementById('search-btn');
const imagesContainer = document.querySelector('.images-container');
const loadMoreBtn = document.querySelector('.loadMoreBtn');
let page = 1;

// Fetch images from Unsplash API
const fetchImages = async (query, pageNo) => {
    if (pageNo === 1) {
        imagesContainer.innerHTML = '';
    }
    const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=28&page=${pageNo}&client_id=${accessKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();

        if (data.results.length === 0) {
            imagesContainer.innerHTML = '<h2>No images found</h2>';
            loadMoreBtn.style.display = 'none';
            return;
        }

        data.results.forEach(photo => {
            const imageElement = document.createElement('div');
            imageElement.classList.add('imageDiv');
            imageElement.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description || 'Image'}"/>`;

            const overlayElement = document.createElement('div');
            overlayElement.classList.add('overlay');
            overlayElement.innerHTML = `<h3>${photo.alt_description || 'No description'}</h3>`;

            imageElement.appendChild(overlayElement);
            imagesContainer.appendChild(imageElement);
        });

        loadMoreBtn.style.display = (data.total_pages > pageNo) ? 'block' : 'none';
    } catch (error) {
        imagesContainer.innerHTML = `<h2>Error fetching images: ${error.message}</h2>`;
        loadMoreBtn.style.display = 'none';
    }
};

// Event listeners
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText) {
        page = 1;
        fetchImages(inputText, page);
    } else {
        imagesContainer.innerHTML = '<h2>Please enter a search query!</h2>';
    }
});

searchBtn.addEventListener('click', () => {
    searchForm.dispatchEvent(new Event('submit'));
});

loadMoreBtn.addEventListener('click', () => {
    fetchImages(searchInput.value.trim(), ++page);
});
