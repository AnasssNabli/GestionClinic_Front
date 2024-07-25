import { alexsys } from "./envirenment";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "multipart/form-data"
};
const updateProgression = async (projetid, etatdata) => {
  try {

    const response = await alexsys.put(`/etatavancement/${projetid}/`, etatdata,{headers});
    return response.data;
  } catch (error) {
    console.error('Error updating etat avancement:', error);
    throw new Error('Failed to update progression');
  }
};

export {updateProgression};
