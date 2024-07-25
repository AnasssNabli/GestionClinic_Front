import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Input,
  IconButton,
} from "@material-tailwind/react";
import { updateProgression } from "@/services/etatavancementservice";
import { confirmation } from "@/widgets/alert_confirmation";
export function Updateetat(props) {
  const [formData, setFormData] = useState({
    ancien_taux_realisation: props.project.new_taux_realisation || 0,
    new_taux_realisation: "" || 0,
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
    if (formData.ancien_taux_realisation === "") {
      newErrors.ancien_taux_realisation = "Ancien taux de réalisation is required";
      isValid = false;
    }
    if (formData.new_taux_realisation === "") {
      newErrors.new_taux_realisation = "Nouveau taux de réalisation is required";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      let confirmer = await confirmation();
            if (confirmer) {
              try {
                await updateProgression(props.project.id_projet, formData);
                props.setReload(formData);
                props.handleOpen();
                console.log("Project updated successfully!");
              } catch (error) {
                console.error("Error updating project:", error);
              }
            } else {
              props.handleOpen();
            }
      
    }
  };

  return (
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
            className="bg-dark"
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
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Modifier Etat d'Avancement
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            Modifier les taux de réalisation du projet
          </Typography>
          <div className="my-4 flex items-center gap-4">
          <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Ancien Taux de Réalisation
              </Typography>
              <Input
                name="ancien_taux_realisation"
                label="Ancien Taux de Réalisation"
                size="lg"
                type="number"
                value={formData.ancien_taux_realisation}
                onChange={(e) => handleChange(e, "ancien_taux_realisation")}
                error={!!errors.ancien_taux_realisation}
              />
            </div>
            <div>
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-2 font-medium"
              >
                Nouveau Taux de Réalisation
              </Typography>
              <Input
                name="new_taux_realisation"
                label="Nouveau Taux de Réalisation"
                size="lg"
                type="number"
                value={formData.new_taux_realisation}
                onChange={(e) => handleChange(e, "new_taux_realisation")}
                error={!!errors.new_taux_realisation}
              />
            </div>
          </div>
          
        </CardBody>
        <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth variant="gradient" onClick={props.handleOpen}>
            Cancel
          </Button>
          <div className="w-4"></div>
          <Button fullWidth variant="gradient" onClick={handleSubmit}>
            Update
          </Button>
        </CardFooter>
      </Card>
    </Dialog>
  );
}
