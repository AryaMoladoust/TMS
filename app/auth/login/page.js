import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-background-shape login-background-shape-one" />
      <div className="login-background-shape login-background-shape-two" />

      <section className="login-container">
        <div className="login-brand">
          <div className="login-brand-icon">
            <img
              src="/icons/icon-192.png"
              alt="لوگوی موسسه حمل و نقل کامران"
            />
          </div>

          <div className="login-brand-text">
            <h1>موسسه حمل و نقل کامران</h1>
            <span>سیستم مدیریت حمل‌ونقل</span>
          </div>
        </div>

        <div className="login-card">
          <div className="login-card-header">
            <h2>ورود به سیستم</h2>
            <p>برای ورود، نام کاربری و رمز عبور خود را وارد کنید.</p>
          </div>

          <LoginForm />


        </div>
      </section>
    </main>
  );
}