if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(function (registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function (error) {
        console.error('Service Worker registration failed:', error);
      })
  }
  
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    const installButton = document.getElementById('install-button');
  
    installButton.addEventListener('click', () => {
      event.prompt();
      event.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User declined the installation');
        }
      });
    });
  
    installButton.style.display = 'block';
  
    // Check if the user is on a PC (Windows, macOS, or Linux) and redirect to the PC installation URL
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win') || userAgent.includes('mac') || userAgent.includes('linux')) {
      // PC (Windows, macOS, or Linux)
      window.location.href = '/install/pc';
    } else if (userAgent.includes('android')) {
      // Android device
      window.location.href = '/install/android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      // iOS device
      window.location.href = '/install/ios';
    }
  });
  