import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Not found</h2>
      <p>Could not find the requested resource.</p>
      <Link href="/">Return home</Link>
    </div>
  );
}
