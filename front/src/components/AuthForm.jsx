import { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/AuthForm.css";

/**
 * @constant AuthForm
 * @description Authentication form component for login and registration.
 * Handles form state, validation, and API requests for user authentication.
 *
 * @returns {JSX.Element} The rendered authentication form.
 */
const AuthForm = () => {
  /**
   * @constant [isLogin, setIsLogin]
   * @description State to toggle between login and registration modes.
   */
  const [isLogin, setIsLogin] = useState(true);

  /**
   * @constant [loading, setLoading]
   * @description State to indicate if the form is submitting.
   */
  const [loading, setLoading] = useState(false);

  /**
   * @constant [message, setMessage]
   * @description State to store feedback messages for the user.
   */
  const [message, setMessage] = useState({ text: "", type: "" });

  /**
   * @constant navigate
   * @description React Router navigation function.
   */
  const navigate = useNavigate();

  /**
   * @function toggleMode
   * @description Toggles between login and registration modes and resets messages.
   */
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage({ text: "", type: "" });
  };

  /**
   * @constant initialValues
   * @description Initial values for the Formik form fields.
   */
  const initialValues = {
    user_name: "",
    password: "",
  };

  /**
   * @constant validationSchema
   * @description Yup validation schema for form fields.
   */
  const validationSchema = Yup.object({
    user_name: Yup.string()
      .min(3, "At least 3 characters")
      .required("Username is required"),
    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password is required"),
  });

  /**
   * @function handleSubmit
   * @description Handles form submission for login or registration.
   * Sends a POST request to the appropriate endpoint and manages UI feedback.
   *
   * @param {Object} values - Form values.
   * @param {Function} resetForm - Formik reset function.
   */
  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const url = isLogin
      ? `${baseUrl}/users/login`
      : `${baseUrl}/users/register`;

    try {
      const res = await axios.post(url, values);
      setMessage({ text: res.data.message || "Success!", type: "success" });
      if (isLogin) {
        console.log("User logged in:", res.data);
        localStorage.setItem("token", res.data.token); // Optional: Save token
        navigate("/booking"); // Navigate to booking page
      }
      resetForm();
    } catch (error) {
      setMessage({
        text: error.response?.data?.message || "An error occurred",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card
        className="p-4 shadow-sm"
        style={{ width: "100%", maxWidth: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-3">{isLogin ? "Login" : "Register"}</h3>

        {message.text && <Alert variant={message.type}>{message.text}</Alert>}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <Field
                  type="text"
                  name="user_name"
                  className="form-control"
                  placeholder="Enter username"
                />
                <div className="text-danger small">
                  <ErrorMessage name="user_name" />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <Field
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                />
                <div className="text-danger small">
                  <ErrorMessage name="password" />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-100"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : isLogin ? (
                  "Login"
                ) : (
                  "Register"
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <div className="text-center mt-3">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button variant="link" onClick={toggleMode}>
            {isLogin ? "Register" : "Login"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthForm;
