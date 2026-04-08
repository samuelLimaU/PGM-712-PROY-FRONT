/*import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignUpForm from "../../components/auth/SignUpForm";

export default function SignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}
*/
// src/pages/AuthPages/SignUp.tsx
import PageMeta from "../../components/common/PageMeta";
import AuthPage from "./AuthPage";

export default function SignUp() {
  return (
    <>
      <PageMeta title="Sign Up" description="Registrarse" />
      <AuthPage initialMode="signup" />
    </>
  );
}