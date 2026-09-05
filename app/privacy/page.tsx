// app/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we handle your information when you use our application.
        </p>

        <div>
          <h2 className="text-base font-semibold text-foreground">1. Information We Collect</h2>
          <p className="mt-1">
            When you sign in using Google OAuth, we collect basic profile information provided by Google, including your email address, full name, and profile picture URL.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">2. How We Use Your Information</h2>
          <p className="mt-1">
            We use your information solely to authenticate your identity, manage your account session, and provide access to features within the application. We do not sell or share your personal data with third parties.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">3. Data Retention & Deletion</h2>
          <p className="mt-1">
            Your personal information is stored securely for as long as your account remains active. You may request account deletion and removal of your personal data at any time by contacting support.
          </p>
        </div>
      </section>
    </main>
  )
}