import { FileJson, Webhook, Database, Cloud, Server, Code, Workflow, Terminal } from "lucide-react"

export function StatsSection() {
  const integrations = [
    { icon: Webhook, name: "Webhooks" },
    { icon: FileJson, name: "JSON API" },
    { icon: Database, name: "Storage" },
    { icon: Cloud, name: "Cloud" },
    { icon: Server, name: "Node.js" },
    { icon: Code, name: "Python" },
    { icon: Workflow, name: "n8n" },
    { icon: Terminal, name: "CLI" },
  ]

  return (
    <section className="py-32 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-16">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            Seamless integrations with your entire stack
          </h2>
          <p className="mt-6 text-xl text-muted-foreground">
            Connect PDFForge to your favorite tools and workflows in minutes.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {integrations.map((item) => (
            <div
              key={item.name}
              className="group flex h-24 w-24 flex-col items-center justify-center gap-2 rounded-3xl bg-background shadow-sm transition-all hover:-translate-y-1 hover:shadow-md border border-border/50"
            >
              <item. icon className="h-8 w-8 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
             <div className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:scale-105 cursor-pointer">
                View all integrations
             </div>
        </div>
      </div>
    </section>
  )
}
