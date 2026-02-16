# SeoulStream 🎬

A simple web app for streaming Korean dramas.

## Features

- 🎭 Browse Korean drama catalog
- ▶️ Smooth streaming experience
- 📱 Responsive design for all devices
- 🔍 Search functionality
- 🎨 Clean and intuitive interface

## Tech Stack

- **Next.js** - React framework
- **React** - UI library
- **TMDB API** - Movie/TV database
- **TypeScript**
- **Tailwind CSS**

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- TMDB API account ([Get your API key here](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
```bash
git clone https://github.com/rizkyakbar1511/seoulstream.git
cd seoulstream
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory and add your environment variables:
```env
API_BASE_URL=
TMDB_API_BASE_URL=
TMDB_READ_ACCESS_TOKEN=
NEXT_PUBLIC_TMDB_IMAGE_URL=
```

4. Run the development server
```bash
pnpm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

| Variable | Description |
|----------|-------------|
| `API_BASE_URL` | Your API base URL |
| `TMDB_API_BASE_URL` | The Movie Database API base URL |
| `TMDB_READ_ACCESS_TOKEN` | Your TMDB API read access token |
| `NEXT_PUBLIC_TMDB_IMAGE_URL` | TMDB image base URL (publicly accessible) |

## Usage

Simply browse the catalog, select a drama, and start streaming!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contact

Muhammad Rizki Akbar - [@rzakbar](https://www.instagram.com/rzakbar)

Project Link: [https://github.com/rizkyakbar1511/seoulstream](https://github.com/yourusername/seoulstream)
