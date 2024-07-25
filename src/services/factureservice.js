import { alexsys } from "./envirenment";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "multipart/form-data"
};
const getfactures = async () => {
  try {
    const response = await alexsys.get('/factures/',{headers}); 
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects list:', error);
    throw new Error('Failed to fetch projects list');
  }  
};  

const createfacture = async (projetid) => {
  try {

    const response = await alexsys.put(`/createfacture/${projetid}/`,{headers});
    return response.data;
  } catch (error) {
    console.error('Error updating projects:', error);
    throw new Error('Failed to update projects');
  }
};
const recouvrer = async (projetid) => {
  try {

    const response = await alexsys.put(`/recouvrement/${projetid}/`,{headers});
    return response.data;
  } catch (error) {
    console.error('Error updating projects:', error);
    throw new Error('Failed to update projects');
  }
};
export {  getfactures,createfacture,recouvrer};
