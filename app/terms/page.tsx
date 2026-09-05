// app/terms/page.tsx
export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-foreground">
      <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: September 2026</p>

      <section className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <div>
          <h2 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="mt-1">
            By creating an account or signing into this application, you agree to abide by these Terms of Service and all applicable local laws and regulations.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">2. Acceptable Use</h2>
          <p className="mt-1">
            You agree not to misuse the service or assist anyone else in doing so. You are responsible for maintaining the security of your account credentials and activity.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-foreground">3. Limitation of Liability</h2>
          <p className="mt-1">
            The service is provided "as is" without warranties of any kind. We are not liable for any indirect damages or data loss resulting from your use of the application.
          </p>
        </div>
      </section>
    </main>
  )
}