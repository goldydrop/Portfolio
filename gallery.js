// --- AREA 1: GLOBAL LAYOUT DATA ---
const siteContent = {
    category1: {
        heading: "MAIN GALLERY TITLE",
        description: "Welcome to my portfolio. Put a short professional biography or artist statement here. Let visitors know who you are, what you specialize in, and what tools or mediums you use.",
        images: [
            { src: "images/folder1/image1.jpg", title: "Artwork Title 1", desc: "Short description of the artwork" },
            { src: "images/folder1/image2.jpg", title: "Artwork Title 2", desc: "Short description of the artwork" },
            { src: "images/folder1/image3.jpg", title: "Artwork Title 3", desc: "Short description of the artwork" },
        ]
    },
    
    category2: {
        heading: "SUB GALLERY TITLE",
        description: "A short description of this sub-category.",
        images: [
            { src: "images/folder2/image1.jpg", title: "Project Name", desc: "Project description" },
            { src: "images/folder2/image2.jpg", title: "Project Name", desc: "Project description" },
        ]
    },

    category3: {
        heading: "SECOND MAIN CATEGORY",
        description: "",
        images: [
            { src: "images/folder3/image1.jpg", title: "Concept Art 1", desc: "Early world building" },
            { src: "images/folder3/image2.jpg", title: "Concept Art 2", desc: "Prop design" },
        ]
    },

    project1: {
        heading: "PROJECT NAME ONE",
        description: "A brief logline or hook for the project.",
        projectText: "<p>This is where you write the details about your specific project. You can describe your role, the tools you used, or the creative process.</p><p>Wrap paragraphs in 'p' tags to create clean line breaks.</p>",
        projectIcon: "images/project1/your-logo.png",
        images: [
            { src: "images/project1/image1.jpg", title: "Project Scene 1", desc: "Interior concept sketch" },
            { src: "images/project1/image2.jpg", title: "Project Scene 2", desc: "Exterior layout" },
        ]
    },

    project2: {
        heading: "PROJECT NAME TWO",
        description: "Another featured project layout...",
        projectText: "<p>Use this space to explain the challenges or successes of this particular client work or personal project.</p>",
        projectIcon: "images/project2/your-logo.png",
        images: [
            { src: "images/project2/image1.jpg", title: "Hero Character", desc: "Main protagonist design" },
            { src: "images/project2/image2.jpg", title: "Villain Character", desc: "Antagonist concept" },
        ]
    }
};

// --- AREA 2: ROUTER & CORE ENGINE ---
let currentCategory = 'category1'; // Changed default to generic category
let currentIndex = 0;
let autoScrollInterval;

const GRID_BATCH_SIZE = 3; 
let gridItemsDisplayed = 0; 

// View Wrappers
const sliderView = document.getElementById('sliderView');
const gridView = document.getElementById('gridView');
const projectSplitView = document.getElementById('projectSplitView');
const contactView = document.getElementById('contactView');

// Hero Slider Elements
const mainImage = document.getElementById('mainImage');
const hoverTitle = document.getElementById('hoverTitle');
const hoverDesc = document.getElementById('hoverDesc');
const thumbnailContainer = document.getElementById('thumbnailContainer');
const bioHeading = document.getElementById('bioHeading');
const bioText = document.getElementById('bioText');

// Grid Elements
const gridHeadline = document.getElementById('gridHeadline');
const portfolioGridContainer = document.getElementById('portfolioGridContainer');
const loadMoreContainer = document.getElementById('loadMoreContainer');

// Split Project Elements
const splitMainImage = document.getElementById('splitMainImage');
const splitHoverTitle = document.getElementById('splitHoverTitle');
const splitHoverDesc = document.getElementById('splitHoverDesc');
const splitThumbnailContainer = document.getElementById('splitThumbnailContainer');
const splitHeading = document.getElementById('splitHeading');
const splitTextContent = document.getElementById('splitTextContent');
const splitIconPlaceholder = document.getElementById('splitIconPlaceholder');

// Modal Elements
const modal = document.getElementById('lightboxModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

// APP ROUTER
function navigateTo(layoutStyle, categoryKey = null) {
    sliderView.style.display = 'none';
    gridView.style.display = 'none';
    projectSplitView.style.display = 'none';
    contactView.style.display = 'none';
    clearInterval(autoScrollInterval);

    if (layoutStyle === 'slider') {
        sliderView.style.display = 'block';
        if (categoryKey) setupSliderCategory(categoryKey);
    } else if (layoutStyle === 'grid') {
        gridView.style.display = 'block';
        if (categoryKey) setupGridCategory(categoryKey);
    } else if (layoutStyle === 'split') {
        projectSplitView.style.display = 'block';
        if (categoryKey) setupSplitCategory(categoryKey);
    } else if (layoutStyle === 'contact') {
        contactView.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ROUTE HANDLER 1: Hero Slider
function setupSliderCategory(categoryKey) {
    if (!siteContent[categoryKey]) return;
    currentCategory = categoryKey;
    currentIndex = 0;
    
    bioHeading.innerText = siteContent[categoryKey].heading;
    bioText.innerText = siteContent[categoryKey].description || "";
    thumbnailContainer.innerHTML = "";
    
    siteContent[currentCategory].images.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.src;
        img.classList.add('thumb'); 
        if (index === 0) img.classList.add('active');
        img.onclick = () => jumpToSlide(index);
        thumbnailContainer.appendChild(img);
    });
    
    syncDisplay();
    renewAutoScroll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ROUTE HANDLER 2: Standard Portfolio Grid
function setupGridCategory(categoryKey) {
    if (!siteContent[categoryKey]) return;
    currentCategory = categoryKey;
    gridItemsDisplayed = GRID_BATCH_SIZE; 
    gridHeadline.innerText = siteContent[categoryKey].heading;
    
    renderGridItems();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderGridItems() {
    portfolioGridContainer.innerHTML = "";
    const allImages = siteContent[currentCategory].images;
    const visibleSubset = allImages.slice(0, gridItemsDisplayed);

    visibleSubset.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('grid-card');
        card.onclick = () => openLightboxAt(index); 

        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title;

        const overlay = document.createElement('div');
        overlay.classList.add('grid-card-overlay');
        overlay.innerHTML = `<h4>${item.title}</h4><p>${item.desc}</p>`;

        card.appendChild(img);
        card.appendChild(overlay);
        portfolioGridContainer.appendChild(card);
    });

    loadMoreContainer.style.display = (gridItemsDisplayed < allImages.length) ? 'block' : 'none';
}

function loadMoreGridItems() {
    gridItemsDisplayed += GRID_BATCH_SIZE;
    renderGridItems();
}

// ROUTE HANDLER 3: Split Project View
function setupSplitCategory(categoryKey) {
    if (!siteContent[categoryKey]) return;
    currentCategory = categoryKey;
    currentIndex = 0;
    
    // Inject right side data
    splitHeading.innerText = siteContent[categoryKey].heading;
    splitTextContent.innerHTML = siteContent[categoryKey].projectText || "<p>No text provided.</p>";
    splitIconPlaceholder.src = siteContent[categoryKey].projectIcon || "";
    
    // Setup Left Side Gallery Thumbs
    splitThumbnailContainer.innerHTML = "";
    siteContent[currentCategory].images.forEach((item, index) => {
        const img = document.createElement('img');
        img.src = item.src;
        img.classList.add('split-thumb', 'thumb'); 
        if (index === 0) img.classList.add('active');
        img.onclick = () => jumpToSlide(index);
        splitThumbnailContainer.appendChild(img);
    });
    
    syncDisplay();
    renewAutoScroll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Global Core Sync Frame Engine
function syncDisplay() {
    const activeSet = siteContent[currentCategory].images;
    if (activeSet.length === 0) return;

    const targetItem = activeSet[currentIndex];
    
    // Update main slider if visible
    if (sliderView.style.display !== 'none') {
        mainImage.src = targetItem.src;
        hoverTitle.innerText = targetItem.title;
        hoverDesc.innerText = targetItem.desc;
        
        const thumbs = thumbnailContainer.querySelectorAll('.thumb');
        thumbs.forEach(t => t.classList.remove('active'));
        if(thumbs[currentIndex]) thumbs[currentIndex].classList.add('active');
    }
    
    // Update split slider if visible
    if (projectSplitView.style.display !== 'none') {
        splitMainImage.src = targetItem.src;
        splitHoverTitle.innerText = targetItem.title;
        splitHoverDesc.innerText = targetItem.desc;
        
        const splitThumbs = splitThumbnailContainer.querySelectorAll('.thumb');
        splitThumbs.forEach(t => t.classList.remove('active'));
        if(splitThumbs[currentIndex]) splitThumbs[currentIndex].classList.add('active');
    }
    
    // Always sync the modal data
    modalImage.src = targetItem.src;
    modalTitle.innerText = targetItem.title;
    modalDesc.innerText = targetItem.desc;
}

function changeSlide(direction) {
    const total = siteContent[currentCategory].images.length;
    currentIndex += direction;
    if (currentIndex >= total) currentIndex = 0;
    if (currentIndex < 0) currentIndex = total - 1;
    syncDisplay();
    renewAutoScroll();
}

function jumpToSlide(index) {
    currentIndex = index;
    syncDisplay();
    renewAutoScroll();
}

function renewAutoScroll() {
    clearInterval(autoScrollInterval);
    if ((sliderView.style.display !== 'none' || projectSplitView.style.display !== 'none') && modal.style.display !== 'block') {
        autoScrollInterval = setInterval(() => { changeSlide(1); }, 4000);
    }
}

// Lightbox Entry Handler
function openLightboxAt(index) {
    currentIndex = index;
    syncDisplay();
    modal.style.display = "block";
    clearInterval(autoScrollInterval);
}

function openModal() {
    modal.style.display = "block";
    clearInterval(autoScrollInterval);
}

function closeModal() {
    modal.style.display = "none";
    renewAutoScroll();
}

window.onclick = function(event) {
    if (event.target === modal) { closeModal(); }
}

// System Initialization
navigateTo('slider', 'category1');