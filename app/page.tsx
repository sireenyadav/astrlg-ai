export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary mb-4">Astrlg AI</h1>
        <p className="text-xl text-foreground/70">Vastu Intelligence Engine</p>
        <div className="mt-8 inline-block animate-pulse px-4 py-2 bg-card border border-border rounded-full text-sm text-accent">
          System Initializing...
        </div>
      </div>
    </main>
  );
}
