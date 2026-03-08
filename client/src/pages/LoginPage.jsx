import { LoginForm } from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <main className="page page-login">
      <section className="card">
        <h1>Mini Fleet Monitor</h1>
        <p>Sign in to access the robot dashboard.</p>
        <LoginForm />
      </section>
    </main>
  );
}

export { LoginPage };
