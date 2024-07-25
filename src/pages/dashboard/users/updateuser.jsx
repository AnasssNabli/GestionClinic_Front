import React from "react";
import { useState,useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Dialog,
  Typography,
  IconButton,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Select,
  Option,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  CreditCardIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { confirmation } from "@/widgets/alert_confirmation";
import { updateuser } from "@/services/usersservices";
export default function Dialogupdateuser(props) {
  const [type, setType] = useState();
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpires, setCardExpires] = useState("");
  const [idrole, setidrole] = useState({id_role:""}); 
  
  useEffect(() => {
    {props.user.id_role === 1
      ? setType("admin")
      : props.user.id_role === 2
      ? setType("bumanager")
      : setType("consultant")}
  }, []);
  const handletab = (role) => {
    if (role === 1) {
      setType("admin");
      setidrole({ ...idrole, id_role: 1 });
    } else if (role === 2) {
      setType("bumanager");
      setidrole({ ...idrole, id_role: 2 });
    } else {
      setType("consultant");
      setidrole({ ...idrole, id_role: 3 });
    }
  };
  const handleSubmit = async () => {

      try {
        await updateuser(props.user.id,idrole);
        props.setReload(idrole);
        props.handleOpen();
        console.log("User added successfully!");
      } catch (error) {
        console.error("Error updating user:", error);
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
      <CardBody>
      <Typography variant="h4" color="blue-gray">
            Modifier l'utilisateur
          </Typography>
          <Typography
            className="mb-3 font-normal"
            variant="paragraph"
            color="gray"
          >
            Modifier le role de l'utilisateur
          </Typography>
        <Tabs value={type} className="overflow-visible pt-10">
          <TabsHeader className="relative z-0 ">
            <Tab value="admin" onClick={() =>handletab(1)}>
              Admin
            </Tab>
            <Tab value="bumanager" onClick={() =>handletab(2)}>
              BU Manager
            </Tab>
            <Tab value="consultant" onClick={() =>handletab(3)}>
              Consultant
            </Tab>
          </TabsHeader>
        </Tabs>
      </CardBody>
      <CardFooter className="pt-0 flex justify-between">
          <Button fullWidth variant="gradient" onClick={props.handleOpen}>
            Cancel
          </Button>
          <div className="w-4"></div> 
          <Button fullWidth variant="gradient" onClick={handleSubmit}>
            Modifier
          </Button>
        </CardFooter>
    </Card>
    </Dialog>
  );
}
