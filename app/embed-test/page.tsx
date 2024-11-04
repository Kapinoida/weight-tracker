export default function EmbedTest() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Embed Test Page</h1>
      <p>If you can see this in Clickup, the embedding is working!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

// Disable static optimization for this page to ensure it's always server-side rendered
export async function getServerSideProps() {
  return {
    props: {},
  };
}
