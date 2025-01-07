const body = document.body;

// Hamburger Menu Toggle for Mobile
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');

hamburgerBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});


const buttonImage = document.getElementById('buttonImage');
buttonImage.addEventListener('click', () => {
    const hover = document.getElementById('hover');
    hover.classList.toggle('backdrop-blur-md');
})