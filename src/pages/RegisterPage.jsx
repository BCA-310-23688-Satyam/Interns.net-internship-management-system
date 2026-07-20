import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthForm from "../components/auth/AuthForm";
import { useAppContext } from "../context/AppContext";
import { authService } from "../services";

const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "student"
};

function RegisterPage() {
  const navigate = useNavigate();
  const { saveAuth } = useAppContext();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    if (!["student", "company"].includes(values.role)) {
      nextErrors.role = "Select a valid role.";
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await authService.register(values);
      const loginResponse = await authService.login({
        email: values.email,
        password: values.password
      });

      saveAuth({
        token: loginResponse.token,
        user: loginResponse.user
      });

      navigate(loginResponse.user.role === "company" ? "/companies" : "/students", {
        replace: true
      });
    } catch (error) {
      setFormError(error.message || "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Register"
      subtitle="Create a student or company account and enter the dashboard with the right role."
      fields={[
        {
          label: "Full name",
          name: "name",
          placeholder: "Your name",
          type: "text"
        },
        {
          label: "Email",
          name: "email",
          placeholder: "you@example.com",
          type: "email"
        },
        {
          label: "Password",
          name: "password",
          placeholder: "Choose a password",
          type: "password"
        },
        {
          label: "Role",
          name: "role",
          type: "select",
          options: [
            { label: "Student", value: "student" },
            { label: "Company", value: "company" }
          ]
        }
      ]}
      values={values}
      errors={errors}
      formError={formError}
      isSubmitting={isSubmitting}
      onChange={handleChange}
      onSubmit={handleSubmit}
      footer={
        <p>
          Already have an account? <Link to="/login">Login instead</Link>
        </p>
      }
    />
  );
}

export default RegisterPage;
