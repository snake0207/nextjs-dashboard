"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import * as dbPool from "@/app/lib/db/pool";
import { fetchInvoices } from "@/app/lib/db/fetch";
import makeExcelReport from "@/app/lib/excel";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status",
  }),
  date: z.string(),
});

export type TState = {
  message?: string | null;
  errors?: object;
};

export type TStateInvoice = TState & {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
};

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export async function createInvoice(
  prevState: TStateInvoice,
  formData: FormData
) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  try {
    await dbPool.transaction(
      `
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES ($1, $2, $3, $4)
  `,
      [`${customerId}`, `${amountInCents}`, `${status}`, `${date}`]
    );
  } catch (error) {
    return {
      message: `Database Error: Failed to Create Invoice.(${error})`,
    };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(
  id: string,
  prevState: TStateInvoice,
  formData: FormData
) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
  `;
  } catch (error) {
    return { message: `Database Error: Failed to Update Invoice.(${error})` };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
    return { message: "Deleted Invoice." };
  } catch (error) {
    return { message: `Database Error: Failed to Delete Invoice.(${error})` };
  }
}

export type TStateExcel = TState & {};

export async function handleExcelReport(query: string) {
  try {
    const invoices = await fetchInvoices(query);
    const datas = invoices.map((invoice) => ({
      이름: invoice.name,
      이메일: invoice.email,
    }));
    const result = await makeExcelReport({
      title: "2025년도 고객정보",
      sheetName: "고객정보",
      datas: datas,
    });
    return (
      result ?? {
        message: "Create excel report Error.",
        file: ``,
      }
    );
  } catch (error) {
    return {
      message: `Database Error: Failed to Select Invoice.(${error})`,
      file: ``,
    };
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      console.log("error.type : ", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
