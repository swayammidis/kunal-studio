// Resizes raw downloads in /assets-src into web-ready masters in /public/images
// and writes content/images.json (dimensions + tiny blur placeholders).
// next/image then generates responsive AVIF/WebP variants at request time.
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const SRC = "assets-src";
const OUT = "public/images";
const manifest = JSON.parse(fs.readFileSync(path.join(SRC, "manifest.json"), "utf8"));
const result = {};

async function processFile(rel, maxEdge) {
  const input = path.join(SRC, rel);
  const outRel = rel.replace(/\.(png|jpe?g)$/i, ".jpg");
  const output = path.join(OUT, outRel);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const img = sharp(input).rotate();
  const { data, info } = await img
    .resize(maxEdge, maxEdge, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(output, data);
  const blur = await sharp(data).resize(12, 12, { fit: "inside" }).jpeg({ quality: 50 }).toBuffer();
  return { src: "/images/" + outRel.split(path.sep).join("/"), width: info.width, height: info.height, blur: "data:image/jpeg;base64," + blur.toString("base64") };
}

for (const [group, items] of Object.entries(manifest)) {
  result[group] = [];
  for (const it of items) result[group].push(await processFile(it.file, group === "home" ? 2400 : 2000));
}
result.films = {};
for (const f of fs.readdirSync(path.join(SRC, "films"))) {
  result.films[f.replace(/\.jpg$/, "")] = await processFile("films/" + f, 1600);
}
fs.writeFileSync("content/images.json", JSON.stringify(result, null, 1));
console.log("done");
