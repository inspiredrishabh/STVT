const backendPort = 5000;
export const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

// Now you can use API_BASE_URL to construct your request URLs or image sources
// For example:
// const imageUrl = `${API_BASE_URL}/api/images/my-image.png`;
// const response = await fetch(`${API_BASE_URL}/api/users`);

// You can also create a helper function for fetch
export const apiRequest = (endpoint, options) => {
    return fetch(`${API_BASE_URL}${endpoint}`, options);
};