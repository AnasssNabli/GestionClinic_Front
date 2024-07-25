import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
  Input,
  IconButton,
  Select,
  Option
} from "@material-tailwind/react";
import { getClientList } from "@/services/clientservices";
import { createproject } from "@/services/projetservices";
import { confirmation } from "@/widgets/alert_confirmation";
export function Addform(props) {
  const [clients, setClients] = useState([]);
  const [type, setType] = useState("forfait");
  
  useEffect(() => {
    async function fetchData() {
      try {
        const cldata = await getClientList();
        setClients(cldata);
      } catch (error) {
        console.error("Error fetching clients list:", error);
      }
    }
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    designiation: "",
    description: "",
    mode_facturation: "forfait",
    Duree: "",
    id_type: "",
    id_client: "",
    montant_ht: "",
    nbrJh: "",
    tarif: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e, name) => {
    const { value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };
  

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.id_client) {
      newErrors.id_client = "Client is required";
      isValid = false;
    }
    if (!formData.id_type) {
      newErrors.id_type = "Client is required";
      isValid = false;
    }
    if (!formData.designiation) {
      newErrors.designiation = "Designation is required";
      isValid = false;
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (formData.mode_facturation === "forfait") {
      if (!formData.montant_ht) {
        newErrors.montant_ht = "Montant HT is required";
        isValid = false;
      }

      if (!formData.Duree) {
        newErrors.Duree = "Duree is required";
        isValid = false;
      }
    } else if (formData.mode_facturation === "JH") {
      if (!formData.tarif) {
        newErrors.tarif = "Tarif is required";
        isValid = false;
      }

      if (!formData.nbrJh) {
        newErrors.nbrJh = "Nombre de jours is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      let confirmer = await confirmation();
            if (confirmer) {
              try {
                if(formData.mode_facturation ==="JH"){
                    formData.Duree="";
                    formData.montant_ht="";
                }
                else{
                    formData.tarif="";
                    formData.nbrJh="";
                }
                await createproject(formData);
                props.setReload(formData);
                props.handleOpen();
                console.log("Project added successfully!");
              } catch (error) {
                console.error("Error adding project:", error);
              }
            } else {
              props.handleOpen();
            }
      
    }
  };

  const handletab = (mode) => {
    if (mode === 1) {
      setType("forfait");
      setFormData({ ...formData, mode_facturation: "forfait" });
    } else if (mode === 2) {
      setType("JH");
      setFormData({ ...formData, mode_facturation: "JH" });
    } 
  };

  return (
    <>
      <Dialog
        open={props.open}
        handler={props.handleOpen}
        className="bg-transparent shadow-none"
      >
        <Card className="mx-auto ps-10 w-full max-w-[33rem]">
          <div className="flex justify-end pe-2 pt-2">
            <IconButton
              size="sm"
              variant="text"
              onClick={props.handleOpen}
              className="bg-dark "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </IconButton>
          </div>
          <CardBody className="flex flex-col gap-4 ">
            <Typography variant="h4" color="blue-gray">
              Ajouter projet
            </Typography>
            <Typography
              className="mb-3 font-normal"
              variant="paragraph"
              color="gray"
            >
              Entrer les details du projet
            </Typography>
            <div className="my-4 flex items-center gap-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Client
                </Typography>
                <Select error={!!errors.id_client} label="Choisir le client" onChange={(e) => setFormData({ ...formData, id_client: e })} 
                  name="id_client">
                  {clients.map(client => (
                    <Option key={client.id} value={client.id.toString()}>
                      {client.raison_sociale}
                    </Option>
                  ))}
                </Select>
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Type
                </Typography>
                <Select
                  error={!!errors.id_type}
                  label="Type"
                  onChange={(e) => setFormData({ ...formData, id_type: e })} 
                  name="id_type"
                >
                  <Option value="2">Projet</Option>
                  <Option value="1">Opportunite</Option>
                </Select>
              </div>
            </div>
            <div className="  items-center gap-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"
                >
                  Designiation
                </Typography>
                <Input
                  name="designiation"
                  label="Designiation"
                  size="lg"
                  value={formData.designiation}
                  onChange={(e) => handleChange(e, "designiation")} 
                  error={!!errors.designiation}
                />

              </div>
            </div>
            <div className="  items-center gap-4">
              <div>
                <Tabs value={type} className="overflow-visible">
                  <TabsHeader className="relative z-0 ">
                    <Tab value="forfait" onClick={() => handletab(1)}>
                      Forfait
                    </Tab>
                    <Tab value="JH" onClick={() => handletab(2)}>
                      JH
                    </Tab>
                  </TabsHeader>
                  <TabsBody
                    className="!overflow-x-hidden !overflow-y-visible"
                    animate={{
                      initial: {
                        x: type === "forfait" ? 400 : -400,
                      },
                      mount: {
                        x: 0,
                      },
                      unmount: {
                        x: type === "forfait" ? 400 : -400,
                      },
                    }}
                  >
                    <TabPanel value="forfait" className="p-0">
                      <form className="mt-12 flex flex-col gap-4">
                        <div className="my-4 flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Montant ht
                            </Typography>
                            <Input
                              name="montant_ht"
                              label="Montant HT"
                              size="lg"
                              value={formData.montant_ht}
                              onChange={(e) => handleChange(e, "montant_ht")} 
                              error={!!errors.montant_ht}
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Durée
                            </Typography>
                            <Input
                              name="Duree"
                              label="Durée"
                              size="lg"
                              value={formData.Duree}
                              onChange={(e) => handleChange(e, "Duree")} 
                              error={!!errors.Duree}
                            />
                          </div>
                        </div>
                      </form>
                    </TabPanel>
                    <TabPanel value="JH" className="p-0">
                      <form className="mt-12 flex flex-col gap-4">
                        <div className="my-4 flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Tarif
                            </Typography>
                            <Input
                              name="tarif"
                              label="Tarif"
                              size="lg"
                              value={formData.tarif}
                              onChange={(e) => handleChange(e, "tarif")} 
                              error={!!errors.tarif}
                            />
                          </div>
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="mb-2 font-medium"
                            >
                              Nombre de jours
                            </Typography>
                            <Input
                              name="nbrJh"
                              label="Nombre de jours"
                              size="lg"
                              value={formData.nbrJh}
                              onChange={(e) => handleChange(e, "nbrJh")} 
                              error={!!errors.nbrJh}
                            />
                          </div>
                        </div>
                      </form>
                    </TabPanel>
                  </TabsBody>
                </Tabs>
              </div>
            </div>
            <Typography className="-mb-2" variant="h6">
              Description
            </Typography>
            <Input
              name="description"
              label="Description"
              size="lg"
              value={formData.description}
              onChange={(e) => handleChange(e, "description")} 
              error={!!errors.description}
            />
          </CardBody>
          <CardFooter className="pt-0 flex justify-between">
            <Button fullWidth variant="gradient" onClick={props.handleOpen}>
              Cancel
            </Button>
            <div className="w-4"></div>
            <Button fullWidth variant="gradient" onClick={handleSubmit}>
              Ajouter
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
}
