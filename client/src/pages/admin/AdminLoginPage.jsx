import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthForm from "../../components/auth/AuthForm";
import { useAppContext } from "../../context/AppContext";
import { authService } from "../../services";

const initialValues = {
  email: "",
  password: ""
};

function AdminLoginPage() {
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
    }

    if (!values.password.trim()) {
      nextErrors.password = "Password is required.";
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
      const response = await authService.adminLogin(values);

      saveAuth({
        token: response.token,
        user: response.user
      });

      navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      setFormError(error.message || "Unable to login as admin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthForm
      title="Admin Login"
      subtitle="Use an administrator account to access system-wide users, internships, applications, and platform metrics."
      fields={[
        {
          label: "Email",
          name: "email",
          placeholder: "admin@example.com",
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
      footer={<p>Administrator access only.</p>}
    />
  );
}

export default AdminLoginPage;
