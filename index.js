import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8000;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const svgTemplatePath = path.join(__dirname, "lib", "badge.svg");
const svgTemplate = fs.readFileSync(svgTemplatePath, "utf-8");

function formatValue(value) {
  if (value >= 1e9) return "$" + (value / 1e9).toFixed(2) + "B";
  if (value >= 1e6) return "$" + (value / 1e6).toFixed(2) + "M";
  if (value >= 1e3) return "$" + (value / 1e3).toFixed(2) + "K";
  return "$" + parseFloat(value).toFixed(2);
}

app.get("/v1/badge.svg", async (req, res) => {
  try {
    const { address, theme = "dark", width, height } = req.query;

    if (!address) {
      return res.status(400).send("Missing address parameter");
    }

    const apiUrl = `https://datapi.jup.ag/v1/assets/search?query=${address}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).send("Token not found");
    }

    const token = data[0];
    const symbol = token.symbol || "UNKNOWN";
    const mcap = token.mcap || token.fdv || 0;
    const formattedMcap = formatValue(mcap);

    const baseWidth = 55;
    const padding = 30;

    const brandTextWidth = 100;
    const symbolWidth = symbol.length * 10;

    const mcapLabelWidth = 35;
    const mcapWidth = formattedMcap.length * 9;

    const leftTextWidth = Math.max(brandTextWidth, symbolWidth);
    const rightTextWidth = Math.max(mcapLabelWidth, mcapWidth);

    const defaultWidth = 250;
    const defaultHeight = 54;

    const calcWidth = Math.max(
      defaultWidth,
      baseWidth + leftTextWidth + padding + rightTextWidth + 15,
    );

    const finalWidth = width ? parseInt(width) : calcWidth;
    const finalHeight = height ? parseInt(height) : defaultHeight;

    let finalSvgTemplate = svgTemplate;

    if (theme === "light") {
      finalSvgTemplate = finalSvgTemplate
        .replace(/fill="#18181B"/g, `fill="#FFFFFF"`)
        .replace(/stroke="#27272A"/g, `stroke="#E4E4E7"`)
        .replace(/fill: #FFFFFF;/g, `fill: #18181B;`)
        .replace(/fill: #A1A1AA;/g, `fill: #71717A;`);
    }

    let finalSvg = finalSvgTemplate
      .replace(/{{TOKEN_NAME}}/g, "$" + symbol)
      .replace(/{{METRIC_COUNT}}/g, formattedMcap)
      .replace(
        /<svg width="250" height="54" viewBox="0 0 250 54"/g,
        `<svg width="${finalWidth}" height="${finalHeight}" viewBox="0 0 ${finalWidth} ${finalHeight}"`,
      )
      .replace(
        /<rect width="250" height="54"/g,
        `<rect width="${finalWidth}" height="${finalHeight}"`,
      )
      .replace(
        "H45V54H8C3.58172 54 0 50.4183 0 46V8Z",
        `H45V${finalHeight}H8C3.58172 ${finalHeight} 0 ${finalHeight - 3.5817} 0 ${finalHeight - 8}V8Z`,
      )
      .replace(/x="240"/g, `x="${finalWidth - 10}"`);

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(finalSvg);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating badge");
  }
});

app.listen(PORT, () => {
  console.log(`Bags Badge Server started on port ${PORT}`);
});
