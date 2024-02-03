function setUserProfilePicture() {
    // Retrieve values from localStorage
    const username = localStorage.getItem('username');
    const hashedPassword = localStorage.getItem('hashedPassword');
    
    // Retrieve the profile picture value from the input field
    const pfpInput = document.getElementById('pfp');
    const pfp = pfpInput.value;

    // Data to be sent in the POST request
    const data = {
        username: username,
        password: hashedPassword,
        pfp: pfp
    };

    // Fetch POST request
    fetch('/api/v3/setUserProfilePicture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response data if needed
        console.log('Profile picture updated successfully:', data);
    })
    .catch(error => {
        // Handle errors
        console.error('Error updating profile picture:', error);
    });
}
