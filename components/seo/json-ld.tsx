// Renders a schema.org block as JSON-LD. Used from server page.tsx files so
// crawlers see it in the initial HTML, right alongside the Open Graph tags
// buildMetadata already sets.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
