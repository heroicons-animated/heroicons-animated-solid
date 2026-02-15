// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link href="/favicon.ico" rel="icon" />
          {assets}
        </head>
        <body class="relative bg-background antialiased">
          <div class="root" id="app">
            {children}
          </div>
          {scripts}
        </body>
      </html>
    )}
  />
));
