import { alexsys } from "./envirenment";
const token = localStorage.getItem("token");
const headers = {
  Authorization: `Bearer ${token}`, 
  "Content-Type": "multipart/form-data"
};
const getproject = async () => {
  try {
    const response = await alexsys.get('/projets/',{headers}); 
    return response.data;
  } catch (error) {
    console.error('Error fetching projects list:', error);
    throw new Error('Failed to fetch projects list');
  }  
};  
const getprojectf = async () => {
  try {
    const response = await alexsys.get('/projetsf/',{headers}); 
    return response.data;
  } catch (error) {
    console.error('Error fetching projects list:', error);
    throw new Error('Failed to fetch projects list');
  }  
}; 
const createproject = async (ProjectData) => {
  try {
    console.log(ProjectData);
    const response = await alexsys.post('/projets/', ProjectData,{headers});
    const response2 = await alexsys.post(`/createfacture/${response.data.id}/`,{headers});
    return response.data;
  } catch (error) {
    console.error('Error creating projects:', error);
    throw new Error('Failed to create projects');
  }
};
const updateProject = async (projetid, projetdata) => {
  try {

    const response = await alexsys.put(`/projets/${projetid}/`, projetdata,{headers});
    return response.data;
  } catch (error) {
    console.error('Error updating projects:', error);
    throw new Error('Failed to update projects');
  }
};
const deleteProject = async (projetId) => {
  try {
    await alexsys.delete(`/projets/${projetId}/delete/`,{headers});
  } catch (error) {
    console.error('Error deleting projects:', error);
    throw new Error('Failed to delete projects');
  }
};

const showproject = async (idp) => {
    try {
      const response = await alexsys.get('/projects/',idp,{headers});
      return response.data;
    } catch (error) {
      console.error('Error fetching project :', error);
      throw new Error('Failed to fetch project');
    }
  };
////////////////les filtres ///////////////
const filtreranne =  async (filteryear) => {
    try {
      const response = await alexsys.post('/filteryear/',filteryear,{headers});
      return response.data;
    } catch (error) {
      console.error('Error filter anne:', error);
      throw new Error('Failed to fetch projects list');
    }
};
const filtrermanager =  async (filterbu) => {
    try {
      const response = await alexsys.post('/filterbu/',filterbu,{headers});
      return response.data;
    } catch (error) {
      console.error('Error filter manager:', error);
      throw new Error('Failed to fetch projects list');
    }
};
const filtrerstatus =  async (filterstatut) => {
    try {
      const response = await alexsys.post('/filterstatut/',filterstatut,{headers});
      return response.data;
    } catch (error) {
      console.error('Error filter status :', error);
      throw new Error('Failed to fetch projects list');
    }
};
const getrole = async () => {
  try {
    const response = await alexsys.get(`/getrole/`, { headers });
    console.log(response.data.idrole);
    return response.data.idrole;
  } catch (error) {
    console.log("error feeetching role", error);
    throw new Error('feetching role echec :(');
  }
};
export { createproject ,getproject,deleteProject,updateProject,filtrermanager,filtrerstatus,filtreranne,getrole,getprojectf};
