import { Code2, Layers, Settings2, Globe, Sparkles, Lock, ArrowRight } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Code2,
      title: "Developer API",
      description: "Robust RESTful API with comprehensive documentation. Integrate seamlessly with your existing stack.",
      color: "bg-indigo-500/10 dark:bg-indigo-500/20",
      textColor: "text-indigo-600 dark:text-indigo-400",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      icon: Layers,
      title: "Smart Layouts",
      description: "Automatically optimizes page sizes and orientations. Support for A4, Letter, and custom dimensions.",
      color: "bg-emerald-500/10 dark:bg-emerald-500/20",
      textColor: "text-emerald-600 dark:text-emerald-400",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Settings2,
      title: "Configuration",
      description: "Granular control over compression, quality, and metadata. Fine-tune every aspect of your PDF output.",
      color: "bg-orange-500/10 dark:bg-orange-500/20",
      textColor: "text-orange-600 dark:text-orange-400",
      iconColor: "text-orange-600 dark:text-orange-400",
    },
    {
      icon: Globe,
      title: "Batch Processing",
      description: "Process images directly from URLs or upload in bulk. Our engine handles concurrent processing efficiently.",
      color: "bg-blue-500/10 dark:bg-blue-500/20",
      textColor: "text-blue-600 dark:text-blue-400",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Sparkles,
      title: "AI Optimization",
      description: "Intelligent image enhancement and compression algorithms ensure the best balance between quality and file size.",
      color: "bg-purple-500/10 dark:bg-purple-500/20",
      textColor: "text-purple-600 dark:text-purple-400",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description: "SOC2 compliant infrastructure with end-to-end encryption. Your data is processed securely and deleted automatically.",
      color: "bg-rose-500/10 dark:bg-rose-500/20",
      textColor: "text-rose-600 dark:text-rose-400",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <section className="py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <h2 className="font-serif text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
            High performance starts here
          </h2>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Everything you need to build powerful PDF workflows, wrapped in a beautiful developer experience.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-[2rem] p-10 transition-all hover:-translate-y-1 hover:shadow-xl ${feature.color}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-background shadow-sm ${feature.iconColor}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                
                <h3 className={`mb-3 text-2xl font-serif font-medium ${feature.textColor}`}>{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-1">{feature.description}</p>
                
                <div className={`flex items-center gap-2 font-semibold text-sm ${feature.textColor} opacity-0 transition-opacity group-hover:opacity-100`}>
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
