# ClickPe - Intelligent Loan Discovery & AI Assistant

ClickPe is a modern financial platform that helps users discover personalized loan offers and interact with an AI-powered banking assistant.

## 🏗️ Architecture

The application follows a modern **Next.js 14+** architecture with server-side rendering and API routes.

```mermaid
graph TD
    Client[Next.js Client] -->|API Requests| API[Next.js API Routes /api/*]
    
    subgraph Data Layer
        API -->|ORM| Prisma[Prisma ORM]
        Prisma -->|Query| DB[(PostgreSQL Database)]
    end
    
    subgraph AI Engine
        API -->|Context + Prompt| Gemini[Google Gemini AI]
        DB -->|Product Data & User Profile| API
    end
```

### Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Database**: PostgreSQL (via Prisma ORM)
- **AI**: Google Gemini Flash 2.0
- **Auth**: JWT (Custom Implementation)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL Database URL

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/harshsrivastava05/ClickPe.ai.git
   cd clickpe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/clickpe"
   JWT_SECRET="your-super-secret-jwt-key"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-api-key"
   ```

4. **Database Migration**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed Data**
   Populate the database with sample loan products:
   ```bash
   npm run seed
   ```

6. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🏆 Badge & Recommendation Logic

The application uses an intelligent filtering system to surface the "Best Match" for each user.

### Best Match Logic
The dashboard automatically highlights the top loan offer using the following algorithm:

1. **Eligibility Filter**: 
   - `User Income >= Product Minimum Income`
   - `User Credit Score >= Product Minimum Credit Score`
2. **Sorting**:
   - Eligible products are sorted by **Lowest APR (Interest Rate)**.
3. **Selection**:
   - The #1 product in this sorted list is tagged as the **Best Match**.
   - If user data is missing, we default to the lowest APR product available.

### Dashboard Stats
- **Loan Eligibility**: Calculated dynamically. If `Monthly Income > ₹50,000`, eligibility is marked as **High**, otherwise **Medium**.
- **Trends**: Visual indicators show improvements in credit score or income stability.

---

## 🧠 AI Grounding Strategy

Our AI Assistant is designed to be **accurate, context-aware, and hallucination-resistant**. We use a **Retrieval-Augmented Generation (RAG)** approach without vectors (Context Injection).

### How it works:

1. **Data Retrieval**:
   - When a user asks a question, we fetch the **Official Product Data** (Terms, Clauses, Fees) from the database.
   - We simultaneously fetch the **User's Financial Profile** (Income, Score) from the verified session.

2. **Context Injection**:
   - We construct a strict System Prompt that includes:
     - `OFFICIAL PRODUCT DATA`: The ground truth.
     - `USER CONTEXT`: For personalization (e.g., "Based on your income of 50k...").
     - `RECOMMENDATIONS`: Top 5 distinct alternatives if the current product isn't a good fit.

3. **Guardrails**:
   - The AI is explicitly instructed to **ONLY** answer using the provided data.
   - If a detail is missing (e.g., "What is the penalty for late payment?" if not in DB), the AI is trained to say "I don't have that specific detail" rather than making it up.

This ensures that users get **reliable financial advice** tailored specifically to their verified profile.
