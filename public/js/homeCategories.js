// Function to fetch videos for different categories
async function fetchVideosForCategory(catParam, numVideos) {
    try {
      let apiUrl = '/api/v1/';
      
      if (catParam === '1' || catParam === '2' || catParam === '3' || catParam === '4') {
        apiUrl += `${catParam === '1' ? 'recentVideos' : catParam === '2' ? 'continueWatching' : catParam === '3' ? 'recommendedVideos' : 'trendingVideos'}?limit=${numVideos}`;
      } else if (catParam === null || catParam === '0') {
        apiUrl += 'recentVideos?limit=3';
      }

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${catParam} videos`);
      }
      const data = await response.json();
      return data.videos || [];
    } catch (error) {
      console.error(`Error fetching ${catParam} videos:`, error);
      return [];
    }
  }

  // Function to render video tiles for different categories
async function renderVideosForCategory(catParam, numVideos, containerId) {
  try {
      const videos = await fetchVideosForCategory(catParam, numVideos);
      const videosContainer = document.getElementById(containerId);

      videosContainer.innerHTML = ''; // Clear previous content

      videos.forEach((video) => {
        const videoTile = document.createElement('div');
        videoTile.className = 'video-home';
        
        // Click event listener to open the video link in the same window
        videoTile.onclick = () => {
            window.open(`/watch?v=${video.VideoID}`, '_self');
        };

          const thumbnail = document.createElement('img');
          thumbnail.className = 'video-thumbnail-home';
          thumbnail.src = video.ThumbnailURL;
          thumbnail.alt = video.Title;

          const videoDetails = document.createElement('div');
          videoDetails.className = 'video-details-home';
          
          const title = document.createElement('h6');
          title.textContent = video.Title;

          const views = document.createElement('p');
          views.textContent = `${video.views} views`; // Assuming 'views' is the property containing the view count
          views.className = 'view-count'; // Adding a class for styling

          videoDetails.appendChild(title);
          videoDetails.appendChild(views);

          videoTile.appendChild(thumbnail);
          videoTile.appendChild(videoDetails);
          videosContainer.appendChild(videoTile);
      });

      console.log(`${catParam} video tiles successfully rendered!`);
  } catch (error) {
      console.error(`Error fetching and rendering ${catParam} video tiles:`, error);
  }
}

// Call the functions to render videos for different categories
const urlParams = new URLSearchParams(window.location.search);
const catParam = urlParams.get('cat');

renderVideosForCategory('1', catParam === null || catParam === '0' ? 3 : 36, 'recentVideos'); // Recent Videos
renderVideosForCategory('2', catParam === null || catParam === '0' ? 3 : 36, 'continueWatching'); // Continue Watching
renderVideosForCategory('3', catParam === null || catParam === '0' ? 3 : 36, 'recommendedVideos'); // Recommended For You
renderVideosForCategory('4', catParam === null || catParam === '0' ? 3 : 36, 'trendingVideos'); // Trending Now