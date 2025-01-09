const path = require('path')
const fs = require('fs');
const express = require('express');

// admin page middleWares


/**
 * Get a list of image file paths from a specified directory.
 * @param {string} dirPath - The directory path to search for images.
 * @returns {Promise<{images: string[], error: string}>} - An object containing images and an error message (if any).
 */
async function getImages(dirPath) {
    try {
        // Check if the directory exists
        if (!fs.existsSync(dirPath)) {
            console.error("Images directory does not exist:", dirPath);
            return { images: [], error: 'Images directory not found!' };
        }

        // Read files from the directory
        const files = await fs.promises.readdir(dirPath);

        // Filter image files and generate paths
        const images = files
            .filter(file => ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(file).toLowerCase()))
            .map(file => `/images/${file}`);

        if (images.length === 0) {
            return { images, error: 'No images found in the directory!' };
        }

        return { images, error: '' };
    } catch (err) {
        console.error("Error reading images directory:", err);
        return { images: [], error: 'An error occurred while fetching images!' };
    }
}

// function for checking session to user be logged in 
function check_session(req) {
    return req.session && req.session.login !== false && req.session.type === 0;
}


// ? Routes middleware functions 


module.exports = {
    getImages,
    check_session,
};