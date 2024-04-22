import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const UploadImagePost = (id,data) => API.put(`/upload/post/${id}`, data);
export const uploadImage = (id, data) => API.put(`/upload/${id}`, data);
// export const uploadPost = (data) => API.post("/posts/", data);
export const uploadPost = (data) => API.post("/posts/", data);
