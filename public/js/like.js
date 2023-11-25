function likeVideo(videoId) {
    // Retrieve username and password from localStorage
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('hashedPassword');

    if (!username || !password) {
        console.error('Username or password not found in localStorage');
        return;
    }

    // Construct the URL with parameters
    const apiUrl = `/api/v2/likeVideo?v=${videoId}&username=${username}&password=${password}`;

    // Make a fetch request to like/unlike the video
    fetch(apiUrl, {
        method: 'GET', // You can adjust the method as per your server-side route
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Handle the response from the server
        // Update like button icon based on the response
        const likeBtn = document.getElementById('likeBtn');

        // Check if video is liked
        const isLiked = data.message === '1'; // Check if the message is '1' indicating the video is liked

        // Update icon class based on like status
        if (isLiked) {
            likeBtn.classList.remove('fa-regular');
            likeBtn.classList.add('fa-solid');
            const likeSpan = document.getElementById("likeSpan");
            if (likeSpan) {
                likeSpan.textContent = parseInt(likeSpan.textContent) + 1;
            }
            console.log("liked video");
        } else {
            likeBtn.classList.remove('fa-solid');
            likeBtn.classList.add('fa-regular');
            const likeSpan = document.getElementById("likeSpan");
            if (likeSpan && parseInt(likeSpan.textContent) > 0) {
                likeSpan.textContent = parseInt(likeSpan.textContent) - 1;
            }
            console.log("unliked video");
        }        
        
        // You might update UI or perform other actions based on the response
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors, show an error message, etc.
    });
}

function dislikeVideo(videoId) {
    // Retrieve username and password from localStorage
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('hashedPassword');

    if (!username || !password) {
        console.error('Username or password not found in localStorage');
        return;
    }

    // Construct the URL with parameters
    const apiUrl = `/api/v2/dislikeVideo?v=${videoId}&username=${username}&password=${password}`;

    // Make a fetch request to dislike the video
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data); // Handle the response from the server
        // Update dislike button icon based on the response
        const dislikeBtn = document.getElementById('dislikeBtn');

        // Check if video is disliked
        const isDisliked = data.message === '1'; // Check if the message is '1' indicating the video is disliked

        // Update icon class based on dislike status
        if (isDisliked) {
            dislikeBtn.classList.remove('fa-regular');
            dislikeBtn.classList.add('fa-solid');
            const dislikeSpan = document.getElementById("dislikeSpan");
            if (dislikeSpan) {
                dislikeSpan.textContent = parseInt(dislikeSpan.textContent) + 1;
            }
            console.log("disliked video");
        } else {
            dislikeBtn.classList.remove('fa-solid');
            dislikeBtn.classList.add('fa-regular');
            const dislikeSpan = document.getElementById("dislikeSpan");
            if (dislikeSpan && parseInt(dislikeSpan.textContent) > 0) {
                dislikeSpan.textContent = parseInt(dislikeSpan.textContent) - 1;
            }
            console.log("undisliked video");
        }
        
        // You might update UI or perform other actions based on the response
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        // Handle errors, show an error message, etc.
    });
}