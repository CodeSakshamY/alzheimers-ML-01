# Alzheimer's Disease Predictor

Advanced ML-based Alzheimer's disease prediction using 33 biomarkers with Supabase PostgreSQL.

## Features

- 🧠 33 biomarker analysis (CSF, Blood, Saliva, Tears, Urine, Molecular)
- 👨‍⚕️ Doctor feedback system (TRUE/FALSE after diagnosis)
- 📈 Real-time accuracy tracking
- 💾 Supabase PostgreSQL integration
- 🎯 Confusion matrix (TP, TN, FP, FN)
- 📊 Beautiful visualizations with Recharts

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run SQL schema in Supabase:
   - Go to Supabase SQL Editor
   - Copy content from `supabase/schema.sql`
   - Run the SQL

3. Run development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## Deploy to Vercel

1. Push to GitHub
2. Import to Vercel
3. Add environment variables from `.env.local`
4. Deploy!

## Tech Stack

- Next.js 14
- React 18
- Supabase (PostgreSQL)
- Tailwind CSS
- Recharts
- Lucide Icons

## License

MIT
