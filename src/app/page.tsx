import { sections } from "@/content/sections";
import { ConceptSection } from "@/components/concept-section";
import { PipelineConnector } from "@/components/pipeline-connector";

export default function Home() {
  return (
    <main className="py-12">
      <header className="mx-auto max-w-5xl px-6 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          How the Model Works
        </h1>
        <p className="mt-2 text-muted-foreground">
          An interactive walkthrough — zoom in on any step, or compare depth
          levels side by side.
        </p>
      </header>

      {sections.map((section, i) => (
        <div key={section.slug}>
          <ConceptSection
            slug={section.slug}
            order={section.order}
            title={section.title}
            caption={section.caption}
            low={section.low}
            medium={section.medium}
            high={section.high}
          />
          {i < sections.length - 1 && <PipelineConnector />}
        </div>
      ))}
    </main>
  );
}
