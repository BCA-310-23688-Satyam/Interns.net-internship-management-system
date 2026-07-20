import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import AuthForm from "../components/auth/AuthForm";
import { getDefaultRouteForRole, useAppContext } from "../context/AppContext";
import { authService } from "../services";

const initialValues = {
  email: "",
  password: ""
};

function LoginPage() {
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
      const response = await authService.login(values);

      saveAuth({
        token: response.token,
        user: response.user
      });

      navigate(getDefaultRouteForRole(response.user.role), {
        replace: true
      });
    } catch (error) {
      setFormError(error.message || "Unable to login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Login"
      subtitle="Access the student or company workspace through a focused product-style sign-in flow."
      fields={[
        {
          label: "Email",
          name: "email",
          placeholder: "you@example.com",
          type: "email"
        },
        {
          label: "Password",
          name: "password",
          placeholder: "Enter your password",
          type: "password"
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
          New here? <Link to="/register">Create an account</Link>
        </p>
      }
    />
  );
}

export default LoginPage;
