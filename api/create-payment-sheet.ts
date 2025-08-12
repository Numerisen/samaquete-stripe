import Stripe from "stripe";

// Vercel serverless function: POST /api/create-payment-sheet
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  // Basic CORS
  const origin = req.headers.origin || "";
  const allowed = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim());
  const isAllowed = allowed.includes("*") || allowed.includes(origin);
  res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "*" : "");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { amount, currency = "usd" } = req.body || {};
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY");

    // Init Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

    // 1) Create a Customer (ephemeral for mobile PaymentSheet)
    const customer = await stripe.customers.create();

    // 2) Ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2024-06-20" }
    );

    // 3) Create PaymentIntent (amount in cents for USD/EUR)
    const value = Math.max(200, Math.floor(Number(amount) || 0));
    const pi = await stripe.paymentIntents.create({
      amount: value,
      currency,
      customer: customer.id,
      automatic_payment_methods: { enabled: true }
    });

    return res.status(200).json({
      paymentIntent: pi.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id
    });
  } catch (e: any) {
    console.error(e);
    return res.status(400).send(e.message || "Error");
  }
}
