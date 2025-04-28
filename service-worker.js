self.addEventListener("install", () => {
  console.debug("installed");
});

self.addEventListener("activate", () => {
  console.debug("activated");
  return self.clients.claim();
});

self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (e) => {
  const encoder = new TextEncoder();
  const contents = encoder.encode(
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
  );

  if (e.request.url.includes("/sw/download")) {
    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i <= 100; i++) {
          controller.enqueue(contents);

          if (i === 100) {
            controller.close();
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      },
    });

    e.respondWith(
      new Response(stream, {
        headers: {
          "Content-Disposition": 'attachment; filename="file.txt"',
          "Cache-Control":
            "no-cache, no-store, must-revalidate, max-age=0, private",
          "Content-Type": "application/octet-stream",
          "X-Content-Type-Options": "nosniff",
          "Content-Length": String(contents.byteLength * 100),
        },
      })
    );
  }
});
