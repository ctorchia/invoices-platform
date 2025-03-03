"use server";

import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";

import { emailClient } from "./utils/mailtrap";
import { formatCurrency } from "./utils/formatCurrency";
import { parseWithZod } from "@conform-to/zod";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { requireUser } from "./utils/hooks";

export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date, //String
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });

  const sender = {
    email: "hello@demomailtrap.com",
    name: "CMT",
  };

  emailClient.send({
    from: sender,
    to: [{ email: "cristian_torchia@yahoo.com.ar" }],
    template_uuid: "313af461-9969-49ae-b3b1-ef864ed252fa",
    template_variables: {
      clientName: submission.value.clientName,
      invoiceNumber: submission.value.invoiceNumber,
      dueDate: new Intl.DateTimeFormat("es-ES", {
        dateStyle: "long",
      }).format(new Date(submission.value.date)),
      totalAmount: formatCurrency({
        amount: submission.value.total,
        currency: submission.value.currency as any,
      }),
      invoiceLink: "Test_InvoiceLink",
    },
  });

  return redirect("/dashboard/invoices");
}
