import { createRequire } from "node:module";
import * as esbuild from "esbuild";
import { rimraf } from "rimraf";
import stylePlugin from "esbuild-style-plugin";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import pkg from "@esbuild-plugins/tsconfig-paths";
import { internalIpV4 } from "internal-ip";
import http from "node:http";
const tsconfigPaths = pkg.default || pkg;

const require = createRequire(import.meta.url);

const args = process.argv.slice(2);
const isProd = args[0] === "--production";

await rimraf("dist");

/**
 * @type {esbuild.BuildOptions}
 */
const esbuildOpts = {
  color: true,
  entryPoints: ["src/main.tsx"],
  outfile: "dist/widget.js",
  write: true,
  bundle: true,
  format: "iife",
  sourcemap: isProd ? false : "linked",
  minify: isProd,
  treeShaking: true,
  jsx: "automatic",
  loader: {
    ".png": "file",
  },
  plugins: [
    tsconfigPaths({ tsconfig: "./tsconfig.json" }),
    stylePlugin({
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    }),
  ],
};

if (isProd) {
  await esbuild.build(esbuildOpts);
} else {
  const localIp = await internalIpV4();
  const ctx = await esbuild.context(esbuildOpts);

  const { host, port } = await ctx.serve({
    servedir: "dist",
    port: 3000,
    host: "0.0.0.0",
  });

  const proxyServer = http.createServer((req, res) => {
    const proxyOptions = {
      hostname: "localhost",
      port: 11434,
      path: req.url.startsWith("/api") ? req.url.substring(4) : req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: "localhost:11434",
      },
    };

    const proxyReq = http.request(proxyOptions, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });
  });

  proxyServer.listen(8080);

  await ctx.watch();

  console.log(`Running on:`);
  console.log(`http://localhost:${port}`);
  if (localIp) {
    console.log(`http://${localIp}:${port}`);
  }
}
