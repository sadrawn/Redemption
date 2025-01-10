// getting the URL and the route
const route = window.location.pathname;
console.log(route);

if (route === "/admin/setting") {

    const gridContainer = document.getElementById('grid-container');
    const toggleButton = document.getElementById('toggle-button');

    toggleButton.addEventListener('click', () => {
        if (gridContainer.classList.contains('h-auto')) {
            // Show the grid
            gridContainer.classList.remove('h-auto', 'opacity-full');
            gridContainer.classList.add('h-0', 'opacity-0');
        } else {
            // Hide the grid
            gridContainer.classList.remove('h-0', 'opacity-0');
            gridContainer.classList.add('h-auto', 'opacity-100');
        }
    });

    // setting page 
    const imageSelector = document.querySelectorAll('.imageSelector');
    const hiddenInput = document.getElementById('hiddenInput');
    imageSelector.forEach((image) => {
        image.addEventListener('click', () => {
            // Remove 'selected' and 'bg-blue-500' from all images
            imageSelector.forEach((img) => {
                img.classList.remove('selected');
                img.classList.remove('bg-gray-500');
            });

            // Add 'selected' and 'bg-blue-500' to the clicked image
            image.classList.add('selected');
            image.classList.add('bg-gray-500');

            // Update hidden input value to the clicked image's src
            let ha = image.querySelector('img').src.split('/');
            hiddenInput.value = ha[4];
        });
    });
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('input', () => {
        const p = document.getElementById('file-state');
        p.textContent = fileInput.files[0].name;
    })
}


if (route === '/admin/users') {

    const addUserBtn = document.getElementById("addUserBtn");
    const addUserForm = document.getElementById("addUser");

    // Add click event to the button
    addUserBtn.addEventListener("click", () => {
        if (addUserForm.classList.contains("h-0")) {
            // Make form visible
            addUserForm.classList.remove("h-0", "opacity-0");
            addUserForm.classList.add("h-auto", "opacity-100");
        } else {
            // Hide form
            addUserForm.classList.add("h-0", "opacity-0");
            addUserForm.classList.remove("h-auto", "opacity-100");
        }
    });

    const userFormTriggers = document.querySelectorAll(".userFormTrigger");
    const editUserForms = document.querySelectorAll(".editUser");

    userFormTriggers.forEach((trigger, index) => {
        trigger.addEventListener("click", () => {
            const editUserForm = editUserForms[index]; // Corresponding form
            if (editUserForm.classList.contains("opacity-0")) {
                editUserForm.classList.remove("opacity-0", "h-0");
                editUserForm.classList.add("opacity-100", "h-auto");
            } else {
                editUserForm.classList.remove("opacity-100", "h-auto");
                editUserForm.classList.add("opacity-0", "h-0");
            }
        });
    });
}
const messageElement = document.getElementById("message");
if (messageElement) {
    // Set a timeout to remove the message after 3 seconds
    setTimeout(() => {
        messageElement.classList.toggle('hidden');
    }, 3000); // 3000 milliseconds = 3 seconds
}

const mobileNavBar = document.querySelector('.mobileNavBar');
const hamburgerBtn = document.getElementById('hamburgerBtn');
hamburgerBtn.addEventListener('click', () => {
    mobileNavBar.classList.toggle('hidden');
})