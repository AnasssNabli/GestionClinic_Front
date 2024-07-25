import axios from "axios";

export const alexsys = axios.create({
    baseURL: "https://localhost:7054/api/",
});
 