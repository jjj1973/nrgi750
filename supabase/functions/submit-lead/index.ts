import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max submissions
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

// Validation
function validatePayload(body: Record<string, unknown>): string | null {
  const { name, address, phone, email, riderName, consentTimestamp } = body;

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return "Ugyldigt navn";
  }
  if (typeof address !== "string" || address.trim().length < 5 || address.trim().length > 200) {
    return "Ugyldig adresse";
  }
  if (typeof phone !== "string" || phone.trim().length < 8 || phone.trim().length > 20) {
    return "Ugyldigt telefonnummer";
  }
  if (typeof phone === "string" && !/^[0-9+\-\s()]+$/.test(phone.trim())) {
    return "Telefonnummer indeholder ugyldige tegn";
  }
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Ugyldig e-mailadresse";
  }
  if (email.trim().length > 255) {
    return "E-mail er for lang";
  }
  if (typeof riderName !== "string" || riderName.trim().length < 1) {
    return "Ugyldig rytter";
  }
  if (typeof consentTimestamp !== "string" || !consentTimestamp) {
    return "Manglende samtykketidsstempel";
  }
  return null;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";

    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: "For mange tilmeldinger. Prøv igen senere." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();

    // Server-side validation
    const validationError = validatePayload(body);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, address, phone, email, riderName, consentTimestamp } = body;

    // Check for Resend API key
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      // Still return success so the form works during development
      console.log("Lead submission (email not sent - no API key):", JSON.stringify(body));
      return new Response(
        JSON.stringify({ success: true, emailSent: false }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);

    const emailHtml = `
      <h2>Ny tilmelding – NRGi x Cykelnerven</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Navn</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Adresse</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(address)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Telefon</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(phone)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">E-mail</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Valgt rytter</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${escapeHtml(riderName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Samtykke</td>
          <td style="padding: 8px; border: 1px solid #ddd;">Ja – ${escapeHtml(consentTimestamp)}</td>
        </tr>
      </table>
    `;

    const emailResponse = await resend.emails.send({
      from: "NRGi x Cykelnerven <noreply@resend.dev>",
      to: ["cykelnerven@nrgi.dk"],
      subject: `Ny støtte – NRGi x Cykelnerven – ${name.trim()}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, emailSent: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error in submit-lead function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
