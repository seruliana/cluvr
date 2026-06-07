const API_BASE_URL = 'http://localhost:4000/api';

// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
}

// Auth helpers
export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  localStorage.setItem('token', token);
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}

// Generic API request with auth
async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
}

// Auth API
export const authAPI = {
  register: async (userData) => {
    const data = await apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  login: async (credentials) => {
    const data = await apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) setToken(data.token);
    return data;
  },

  logout: () => {
    removeToken();
  },

  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (userData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  saveQuizResults: async (quizData) => {
    return apiRequest('/users/quiz-results', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  getQuizResults: async () => {
    return apiRequest('/users/quiz-results');
  },

  deleteAccount: async () => {
    return apiRequest('/users/account', {
      method: 'DELETE',
    });
  },
};

// Clubs API
export const clubsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/clubs${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/clubs/${id}`);
  },

  create: async (clubData) => {
    return apiRequest('/clubs', {
      method: 'POST',
      body: JSON.stringify(clubData),
    });
  },

  update: async (id, clubData) => {
    return apiRequest(`/clubs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clubData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/clubs/${id}`, {
      method: 'DELETE',
    });
  },

  follow: async (id) => {
    return apiRequest(`/clubs/${id}/follow`, {
      method: 'POST',
    });
  },
};

// Events API
export const eventsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getById: async (id) => {
    return apiRequest(`/events/${id}`);
  },

  create: async (eventData) => {
    return apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  update: async (id, eventData) => {
    return apiRequest(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  delete: async (id) => {
    return apiRequest(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  like: async (id) => {
    return apiRequest(`/events/${id}/like`, {
      method: 'POST',
    });
  },
};

// Favorites API
export const favoritesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiRequest(`/favorites${queryString ? `?${queryString}` : ''}`);
  },

  add: async (itemData) => {
    return apiRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  remove: async (id) => {
    return apiRequest(`/favorites/${id}`, {
      method: 'DELETE',
    });
  },

  check: async (itemType, itemId) => {
    return apiRequest(`/favorites/check/${itemType}/${itemId}`);
  },
};

// User actions API
export const userActionsAPI = {
  saveClub: async (clubId) => {
    return apiRequest(`/users/save-club/${clubId}`, {
      method: 'POST',
    });
  },

  joinEvent: async (eventId) => {
    return apiRequest(`/users/join-event/${eventId}`, {
      method: 'POST',
    });
  },
};

export default {
  auth: authAPI,
  clubs: clubsAPI,
  events: eventsAPI,
  favorites: favoritesAPI,
  userActions: userActionsAPI,
};
