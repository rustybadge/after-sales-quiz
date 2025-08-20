# After Sales Quiz

An interactive assessment tool to evaluate your after-sales performance across 6 key categories:

- **First-Time-Fix (FTF)** - 25% weight
- **Remote Triage** - 20% weight  
- **Parts Availability** - 20% weight
- **ETA Discipline** - 15% weight
- **Playbooks & Enablement** - 10% weight
- **Predictive Monitoring** - 10% weight

## Features

- 12 targeted questions (~3-4 minutes)
- Category-weighted scoring
- Persona mapping (Predictor, Optimizer, Stabiliser, Firefighter)
- Top 3 tailored action recommendations
- Print-to-PDF functionality
- Email integration for results

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── App.tsx              # Main app component
├── AfterSalesQuiz.tsx   # Quiz component with all logic
├── main.tsx            # React entry point
└── index.css           # Global styles with Tailwind CSS
```

## Customization

The quiz is designed to be easily customizable:

- Modify `QUESTIONS` array to add/remove questions
- Adjust `WEIGHTS` to change category importance
- Update `ACTIONS` for different recommendations
- Customize `persona()` function for different scoring thresholds

## Built With

- React 18
- TypeScript
- Vite
- Tailwind CSS

## License

MIT License - feel free to use and modify for your needs.
