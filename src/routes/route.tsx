import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthmiddlewareProps {
  children: ReactNode;
}

const Authmiddleware: React.FC<AuthmiddlewareProps> = (props) => {
  const navigate = useNavigate();

  // if (!localStorage.getItem("authUser")) {
  //   navigate("/", { state: { from: window.location.pathname } });
  //   return null; 
  // }

  return <React.Fragment>{props.children}</React.Fragment>;
};

export default Authmiddleware;
