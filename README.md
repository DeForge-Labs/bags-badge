# 🎒 Bags.fm Badge Generator

A sleek, dynamic SVG badge generator and frontend companion for showcasing real-time Solana token market caps from [Bags.fm](https://bags.fm). Built with Node.js, Express, and the Jupiter Data API.

## Features

- **Dynamic SVGs:** Badges automatically resize themselves perfectly to fit the token's symbol name and formatted market cap length.
- **Real-Time Data:** Fetches live token data (Market Cap, FDV, Symbol) via the Jupiter Data API.
- **Light & Dark Modes:** Generate badges in seamless dark mode (default) and vivid light mode using a simple `?theme=light` query parameter.
- **Beautiful Frontend:** Generates an embeddable HTML link snippet via a sleek, highly polished glassmorphism frontend inspired by Product Hunt.
- **Smart Formatting:** Auto-converts numbers to heavily compressed readable formats (e.g. `$10.8K`, `$1.2M`, `$4.5B`).

## 🚀 Getting Started

### Installation

1. Clone this repository to your local machine:
   ```bash
   git clone <your-repository-url>
   cd bags-badge
   ```
2. Install the library dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server, you can use:

```bash
npm run dev
```

The server will automatically start on `http://localhost:8000`.

## 🛠️ Usage

### Using the Visual Generator (Frontend)

1. Open a browser and navigate to `http://localhost:8000/`.
2. Input any valid Solana Token Address.
3. Select your desired theme (Dark or Light).
4. Click **"Generate Badge"**.
5. The live preview will fetch and compile your token badge immediately.
6. Copy the HTML snippet below it to embed the link and badge on your website/product exactly like Product Hunt!

### Direct API Navigation

You can embed the badge as an image directly anywhere by linking standard HTML `<img>` tags directly to the API endpoint with query parameters:

**Dark Theme Badge:**
```html
<img src="https://<your-hosted-domain>/v1/badge.svg?address=<SOLANA_TOKEN_ADDRESS>" alt="Bags.fm Badge">
```

**Light Theme Badge:**
```html
<img src="https://<your-hosted-domain>/v1/badge.svg?address=<SOLANA_TOKEN_ADDRESS>&theme=light" alt="Bags.fm Badge">
```

## 🏗 Built With
- **Node.js** & **Express**
- **Jupiter Datapi v1** for token metadata
- Vanilla CSS, Vanilla JS, and **HTML5** for frontend.

---
*Try out [Deforge.io](https://deforge.io) - The Canva for AI Agents.*
