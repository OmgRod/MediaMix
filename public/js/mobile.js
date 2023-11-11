// Check if the "mobileprompt" localStorage value is undefined or 0
/* if (localStorage.getItem('mobileprompt') === null || localStorage.getItem('mobileprompt') === '0') {
    // Check if the user is on iOS and using a browser
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        // Check if the user is not using the "Add to Home Screen" app version
        if (!window.navigator.standalone) {
            // Check if the 'install_prompt' key is not defined or is 0
            if (localStorage.getItem('install_prompt') === null || localStorage.getItem('install_prompt') === '0') {
                // Set the 'install_prompt' key to 0
                localStorage.setItem('install_prompt', '0');
                console.log('The install_prompt key is not defined or is 0, so it has been set to 0 in localStorage.');
                
                // Redirect to the iOS installation page
                window.location.href = '/install/ios';
            } else {
                console.log('The install_prompt key is already defined in localStorage or is set to 1.');
            }
        }
    } else if (/Android/.test(navigator.userAgent)) {
        // Redirect to the Android installation page
        window.location.href = '/install/android';
    }
}
*/