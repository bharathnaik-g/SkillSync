const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getToken = () => localStorage.getItem("skillbridge_token");
export const setToken = (token) => localStorage.setItem("skillbridge_token", token);
export const removeToken = () => localStorage.removeItem("skillbridge_token");

async function request(endpoint, options = {}) {
  const token = getToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = { message: "An unexpected response was received from the server." };
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired or invalid
      // We don't forcefully clear token if it's login endpoint failing
      if (!endpoint.includes("/api/auth/login") && !endpoint.includes("/api/auth/register")) {
        removeToken();
        // Option to trigger auth change event or let context handle it
        window.dispatchEvent(new Event("auth:unauthorized"));
      }
    }
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authAPI = {
  register: (userData) => request("/api/auth/register", { method: "POST", body: JSON.stringify(userData) }),
  login: (credentials) => request("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
};

export const profileAPI = {
  getProfile: () => request("/api/profile"),
  updateProfile: (profileData) => request("/api/profile", { method: "PUT", body: JSON.stringify(profileData) }),
};

export const matchAPI = {
  getMatches: (query) => request(query ? `/api/matches?q=${encodeURIComponent(query)}` : "/api/matches"),
};

export const sessionAPI = {
  createSession: (sessionData) => request("/api/sessions", { method: "POST", body: JSON.stringify(sessionData) }),
  getSessions: () => request("/api/sessions"),
  updateSessionStatus: (id, status) => request(`/api/sessions/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  updateMeetingLink: (id, meetingLink) => request(`/api/sessions/${id}/meeting-link`, { method: "PATCH", body: JSON.stringify({ meetingLink }) }),
  getMessages: (id) => request(`/api/sessions/${id}/messages`),
  submitReview: (id, reviewData) => request(`/api/sessions/${id}/review`, { method: "POST", body: JSON.stringify(reviewData) }),
  getUserReviews: (userId) => request(`/api/sessions/reviews/${userId}`),
};

export const roadmapAPI = {
  generateRoadmap: (params) => request("/api/roadmaps/generate", { method: "POST", body: JSON.stringify(params) }),
  getRoadmaps: () => request("/api/roadmaps"),
  getRoadmapById: (id) => request(`/api/roadmaps/${id}`),
};
