"use client"

import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import LoginForm from "@module/auth/component/LoginForm";

export default function LoginPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}
