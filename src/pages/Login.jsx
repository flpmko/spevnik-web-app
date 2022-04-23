import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase-config";
import { useUserAuth } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checked, setChecked] = useState(false);
  const toast = useRef();
  const { login } = useUserAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login(email, password);
      setError("");
      navigate("/spevnik-web-app/songs");
    } catch (err) {
      setError(err.message);
    }
  };

  const formatError = (message) => {
    switch (message) {
      case "Firebase: Error (auth/wrong-password).":
        setError("Nesprávne heslo!");
        break;
      case "Firebase: Error (auth/user-not-found).":
        setError("Užívateľ nebol nájdený.");
        break;
      case "Firebase: Error (auth/invalid-email).":
        setError("Nesprávny email!");
        break;
      case "Firebase: Error (auth/internal-error).":
        setError("Chyba prihlasovania!");
        break;
      default:
        break;
    }
  };

  const renderErrorMessage = (message) => {
    if (message === "") {
      return null;
    } else {
      formatError(message);
    }
    return (
      <Message severity="error" text={message} style={{ marginLeft: "20px" }} />
    );
  };

  const showToast = (severity, summary, message) => {
    toast.current.show({
      severity: severity,
      summary: summary,
      detail: message,
      life: 3000,
    });
  };

  const forgottenPassword = () => {
    if (email) {
      sendPasswordResetEmail(auth, email).then(() =>
        showToast("success", "Success", "Email odoslaný.")
      );
    } else {
      showToast("error", "Error", "Zadaj email.");
    }
  };

  return (
    <div style={{ marginTop: "10rem" }}>
      <Toast ref={toast} />
      <div className="flex align-items-center justify-content-center">
        <div
          className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
          style={{ maxWidth: "640px" }}
        >
          <div className="text-center mb-5">
            <i className="logo-spevnik-big"></i>
            <div className="text-900 text-3xl font-medium mb-3">
              Vitaj! Najskôr sa prihlás 🤓
            </div>
            {renderErrorMessage(error)}
          </div>

          <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">
              Používateľské meno
            </label>
            <InputText
              id="email"
              type="text"
              className="w-full mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label
              htmlFor="password"
              className="block text-900 font-medium mb-2"
            >
              Heslo
            </label>
            <InputText
              id="password"
              type="password"
              className="w-full mb-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex align-items-center justify-content-between mb-6">
              <div className="flex align-items-center">
                <Checkbox
                  id="rememberme"
                  onChange={(e) => setChecked(e.checked)}
                  checked={checked}
                  binary
                  className="mr-2"
                />
                <label htmlFor="rememberme">Zapamätaj si ma</label>
              </div>
              <span
                className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer"
                onClick={forgottenPassword}
              >
                Zabudnuté heslo
              </span>
            </div>

            <Button
              label="Prihlásiť"
              icon="pi pi-user"
              className="w-full"
              onClick={handleLogin}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
