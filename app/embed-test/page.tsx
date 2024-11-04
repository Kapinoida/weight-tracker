// app/embed-test/page.tsx
export const dynamic = "force-dynamic"; // this ensures the page is not static

export default function EmbedTest() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Embed Test Page</h1>
      <p className="mb-2">
        If you can see this in Clickup, the embedding is working!
      </p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}
