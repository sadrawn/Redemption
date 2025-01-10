const body = document.body;

// Hamburger Menu Toggle for Mobile
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


// const darkOverlay = document.getElementById('darkOverlay');
// darkOverlay.addEventListener('click', () => {
//     darkOverlay.classList.toggle('backdrop-blur-md');
// });
