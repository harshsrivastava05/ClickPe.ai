import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { messages, productId } = await req.json();

    if (!productId) {
      return new Response('Product ID is required', { status: 400 });
    }

    // AUTHENTICATION: Get user from token
    let userId: string | undefined;
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key') as any;
            userId = decoded.userId;
        }
    } catch (e) {
        console.log("Auth error in chat:", e);
    }

    const [product, user, allProducts] = await Promise.all([
      prisma.product.findUnique({ where: { id: productId } }),
      userId ? prisma.user.findUnique({ where: { id: userId } }) : Promise.resolve(null),
      prisma.product.findMany()
    ]);

    if (!product) {
      return new Response('Product not found', { status: 404 });
    }

    // Calculate Best Matches (Alternatives)
    let bestMatchesContext = "";
    if (user && user.monthly_income && user.credit_score) {
      const eligibleProducts = allProducts.filter(p => 
        p.id !== product.id && // Exclude current product
        Number(p.min_income) <= Number(user.monthly_income) &&
        (p.min_credit_score ?? 0) <= (user.credit_score ?? 0)
      );

      // Sort by APR (lowest first)
      eligibleProducts.sort((a, b) => Number(a.rate_apr) - Number(b.rate_apr));

      const top5 = eligibleProducts.slice(0, 5);

      if (top5.length > 0) {
        bestMatchesContext = `
        TOP 5 RECOMMENDED ALTERNATIVES (Better options for this user based on eligibility):
        ${top5.map(p => `- ${p.bank} ${p.name}: ${Number(p.rate_apr)}% APR, Min Income: ₹${Number(p.min_income)}`).join('\n')}
        `;
      } else {
        bestMatchesContext = "\nNo other eligible products found for this user.";
      }
    }

    // Context Construction
    const context = `
      You are a helpful and knowledgeable banking assistant for "Clickpe".
      You are answering questions about a specific loan product: "${product.bank} ${product.name}".
      
      HERE IS THE OFFICIAL PRODUCT DATA:
      - Loan Type: ${product.type}
      - Interest Rate (APR): ${Number(product.rate_apr)}%
      - Minimum Income Requirement: ₹${Number(product.min_income)}
      - Minimum Credit Score: ${product.min_credit_score}
      - Tenure Range: ${product.tenure_min_months} to ${product.tenure_max_months} months
      - Processing Fee: ${Number(product.processing_fee_pct)}%
      - Prepayment: ${product.prepayment_allowed ? 'Allowed' : 'Not Allowed'}
      - Disbursal Speed: ${product.disbursal_speed}
      - Documentation Level: ${product.docs_level}
      - Summary: ${product.summary}
      - Specific Clauses: ${product.clauses}
      - FAQs: ${product.faq}
      - Terms: ${product.terms}

      ${bestMatchesContext}

      USER CONTEXT (Use this to personalize the answer):
      ${user ? `
      - Name: ${user.display_name}
      - Monthly Income: ₹${user.monthly_income}
      - Credit Score: ${user.credit_score}
      - Existing Loans: 0 (Data not in DB yet)
      ` : 'No specific user data provided.'}

      INSTRUCTIONS:
      1. Answer ONLY using the data provided above.
      2. If the user asks something not in the data, verify if it's a general banking question. If specific to this loan and data is missing, say "I don't have that specific detail currently."
      3. PERSONALIZE the answer if user data is available (e.g., "Hi Alex, based on your income of...").
      4. Check eligibility implicitly if they ask (compare user income/score to product requirements).
      5. IF THE USER IS NOT ELIGIBLE or asks about better options, RECOMMEND products from the "TOP 5 RECOMMENDED ALTERNATIVES" list.
      6. Be concise, polite, and professional.
      7. Format answers nicely (use bullet points if listing).
    `;

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
       const lastMsg = messages[messages.length - 1].content;
       return new Response(`[DEMO MODE - No API Key] You asked: "${lastMsg}". \n\nBased on ${product.name}, the APR is ${Number(product.rate_apr)}%. (Configure GOOGLE_GENERATIVE_AI_API_KEY to get real AI responses).`);
    }

    // Save User Message
    if (user) {
      const lastUserMsg = messages[messages.length - 1];
      if (lastUserMsg.role === 'user') {
        await prisma.chatMessage.create({
          data: {
            user_id: user.id,
            product_id: product.id,
            role: 'user',
            content: lastUserMsg.content
          }
        });
      }
    }

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: context,
      messages,
      onFinish: async (completion) => {
        if (user) {
          await prisma.chatMessage.create({
            data: {
              user_id: user.id,
              product_id: product.id,
              role: 'assistant',
              content: completion.text
            }
          });
        }
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}