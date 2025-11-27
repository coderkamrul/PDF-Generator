import { Code2, Layers, Settings2, Globe } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Developer-Friendly API",
      description:
        "RESTful API with comprehensive documentation. Integrate with n8n, Make, Zapier, or build custom solutions.",
    },
    {
      icon: Layers,
      title: "Flexible Page Sizes",
      description: "Support for A4, Letter, custom dimensions. Choose between contain or cover fitting modes.",
    },
    {
      icon: Settings2,
      title: "Advanced Options",
      description: "Control orientation, quality, and compression. Fine-tune output to your exact specifications.",
    },
    {
      icon: Globe,
      title: "URL Processing",
      description: "Process images directly from URLs. No need to upload - just send the links via API.",
    },
  ]

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to work with PDFs
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            Powerful features for individuals and businesses alike
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
