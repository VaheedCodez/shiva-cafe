/**
 * Static dev server with live-reload.
 * - Reachable on the local network (open it from your phone on the same Wi-Fi)
 * - Prints the external URL as a QR code in the terminal
 *
 * Run: npm run watch
 */
const os = require("os");
const browserSync = require("browser-sync").create();
const qrcode = require("qrcode-terminal");

const PORT = Number(process.env.PORT) || 3000;

// Find the first non-internal IPv4 address (LAN IP) as a fallback
function lanIP() {
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const net of iface || []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return null;
}

browserSync.init(
  {
    server: {
      baseDir: ".",
      index: "index.html",
    },
    port: PORT,
    // Changes to these files trigger a browser reload
    files: [
      "*.html",
      "assets/**/*.css",
      "assets/**/*.js",
      "assets/**/*.{png,jpg,jpeg,svg,gif,webp}",
    ],
    open: false, // set to "local" if you want the browser to open automatically
    notify: false, // hide the "Connected to BrowserSync" toast in the page
    ghostMode: false, // don't mirror clicks/scroll across devices
    ui: { port: PORT + 1 },
    logPrefix: "shiva-cafe",
  },
  (err, bs) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const urls = bs.options.get("urls");
    const local = urls.get("local");
    const ip = lanIP();
    const external = urls.get("external") || (ip ? `http://${ip}:${PORT}` : null);

    console.log("\n  Local:    " + local);
    if (external) {
      console.log("  Network:  " + external + "\n");
      console.log("  Scan this QR from a phone on the same Wi-Fi:\n");
      qrcode.generate(external, { small: true });
      console.log("");
    } else {
      console.log("  (no network address found - are you connected to a network?)\n");
    }
  }
);
