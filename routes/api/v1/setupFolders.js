const fs = require('fs');
const path = require('path');

// Function to create the "uploads" folder if it doesn't exist
function createUploadsFolder() {
    const uploadsFolderPath = path.join(__dirname, '..', 'uploads');

    // Check if the folder exists
    if (!fs.existsSync(uploadsFolderPath)) {
        // Create the folder if it doesn't exist
        fs.mkdirSync(uploadsFolderPath);
    }
}

module.exports = createUploadsFolder;
