# LawyeredUp: AI-Powered Legal Document Analysis

LawyeredUp is a web application designed to demystify complex legal documents. Users can upload contracts, agreements, and other legal texts to receive AI-powered analysis, including simple summaries, risk identification, and suggested counter-proposals. It empowers startups, small businesses, and individuals to understand legal jargon without needing a lawyer for every review.

## Key Features

- **Document Upload**: Supports various formats including `.pdf`, `.docx`, and `.txt`.
- **Paste Text**: Directly paste text from any source for quick analysis.
- **AI-Powered Analysis**:
  - **Plain Language Summaries**: Get summaries at different complexity levels (e.g., "Explain Like I'm 5").
  - **Risk Identification**: Clauses are automatically categorized as "Risky," "Negotiable," or "Standard."
  - **Counter-Proposals**: Receive AI-generated suggestions for improving risky or negotiable clauses.
- **Interactive Document Viewer**: Click on highlighted clauses to see detailed analysis in a popover.
- **Advanced AI Tools**: Explore a full suite of AI features, including:
  - Answering specific questions about the document.
  - Comparing different versions of a contract.
  - Generating summaries for different audiences (Lawyer, Layman, Risk-focused).
  - Tracking compliance dates and obligations.
- **Responsive Design**: Modern, clean interface that works on all devices.
- **Dark/Light Mode**: Toggle between themes for user comfort.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router & Turbopack)
- **AI Integration**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **AI Models**: Google Gemini family
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Deployment**: [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lawyered-up.git
cd lawyered-up
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

You'll need a Google Gemini API key to use the AI features.

1.  Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Create a new file named `.env` in the root of your project.
3.  Add your API key to the `.env` file:

    ```
    GEMINI_API_KEY=your_api_key_here
    ```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

## Deployment

This application is configured for easy deployment on [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the repository into your Vercel account.
3.  **Add Environment Variable**: In your Vercel project settings, add the `GEMINI_API_KEY` with its value.
4.  Click "Deploy." Vercel will automatically detect the Next.js framework and deploy your application. The `vercel.json` file in this repository contains the necessary rewrite rules for the Genkit API flows to work correctly.
