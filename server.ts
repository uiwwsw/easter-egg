Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);
    const filePath = "." + url.pathname;

    // Serve index.html for the root path
    if (url.pathname === "/") {
      return new Response(Bun.file("./index.html"));
    }

    // Handle index.js specifically by transpiling index.ts
    if (url.pathname === "/index.js") {
      const content = await Bun.file("./index.ts").text();
      const transpiled = await Bun.transpile(content, { loader: 'ts' });
      return new Response(transpiled, { headers: { 'Content-Type': 'application/javascript' } });
    }
    const file = Bun.file(filePath);
    if (file) {
      return new Response(file);
    }

    return new Response("Not Found", { status: 404 });
  },
  port: 3000,
});

console.log("Server running on http://localhost:3000");
