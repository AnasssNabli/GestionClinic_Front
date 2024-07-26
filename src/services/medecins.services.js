import { alexsys } from "./envirenment"; 
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "multipart/form-data"
};

export const fetchMedecins = () => {
     return  alexsys.get('/Medecin/',{headers}); 
  } 


export const deleteMedecin =  (id) => {
    return alexsys.delete(`/Medecin/${id}`,{headers});
};

export const createMedecin = (medecin) => {
  return alexsys.post('/Medecin/' , medecin , {headers})
}