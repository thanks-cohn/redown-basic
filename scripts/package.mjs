import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { zipSync, strToU8 } from "fflate";
const files = {};
async function walk(path) {
  for (const d of await readdir(path, { withFileTypes: true })) {
    const p = `${path}/${d.name}`;
    if (d.isDirectory()) await walk(p);
    else files[p] = new Uint8Array(await readFile(p));
  }
}
await walk("extension");
for (const p of ["README.md", "LICENSE", "THIRD_PARTY_NOTICES.md"])
  files[p] = strToU8(await readFile(p, "utf8"));
await mkdir("dist", { recursive: true });
await writeFile("dist/redown-basic.zip", zipSync(files));
console.log(
  "Created dist/redown-basic.zip. Load its extension/ directory unpacked; OAuth client setup required. Not live-release-certified.",
);
