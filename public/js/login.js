// Extract username and password from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const password = urlParams.get('password');

// Send a GET request to the /api/v1/loginAccount endpoint with URL parameters
fetch(`/api/v1/loginAccount?username=${username}&password=${password}`)
    .then((response) => response.json())
    .then((data) => {
        if (data.result === 'success') {
            // Store the username and hashed password in localStorage
            localStorage.setItem('username', data.username);
            localStorage.setItem('hashedPassword', password);
            console.log('Data stored in localStorage successfully');

            window.open('/', '_self')
        } else {
            console.error('Authentication failed');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
