import { NextResponse } from "next/server";
import { emailClient } from "@/app/utils/mailtrap";
import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const session = await requireUser();

    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const sender = {
      email: "hello@demomailtrap.com",
      name: "CMT",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "cristian_torchia@yahoo.com.ar" }],
      template_uuid: "dac0849c-34e2-4fb0-be30-6632c956425b",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "CMT Invoice",
        company_info_address: "Ader 3625",
        company_info_city: "Carapachay",
        company_info_zip_code: "345345",
        company_info_country: "Argentina",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
