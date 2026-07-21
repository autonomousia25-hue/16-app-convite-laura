import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import * as z from "zod";

const rsvpSchema = z.object({
  nome: z.string().min(2),
  adultos: z.number().min(1),
  criancas: z.number().min(0),
});

function nowInBrazil() {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = rsvpSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { nome, adultos, criancas } = parsed.data;
  const total = adultos + criancas;

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEETS_SPREADSHEET_ID,
    range: "Confirmações!A:E",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[nowInBrazil(), nome, adultos, criancas, total]],
    },
  });

  return NextResponse.json({ nome, total });
}
