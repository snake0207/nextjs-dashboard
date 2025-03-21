"use client";

import { deleteInvoice, handleExcelDownload } from "@/app/lib/action";
import {
  ArrowDownIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useActionState } from "react";

const initFormState = {
  success: false,
  message: "",
};

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}

export function DownloadInvoice({
  dataLen,
  query,
}: {
  dataLen: number;
  query: string;
}) {
  const handleExcelDownloadWithQuery = handleExcelDownload.bind(null, query);
  const [formState, formAction] = useActionState(
    handleExcelDownloadWithQuery,
    initFormState
  );
  const disableClass = dataLen === 0 ? "bg-gray-300 cursor-not-allowed" : "";

  console.debug("formState >> ", formState);

  return (
    <form action={formAction} id={"id-download"}>
      <div className={"hidden md:block "}>
        <button
          disabled={dataLen === 0 ? true : false}
          aria-describedby="download-error"
          className={`flex items-center justify-center w-[160px] rounded-md border p-2 bg-green-400 text-white ${disableClass}`}
        >
          <span className="">Export</span>{" "}
          <ArrowDownIcon className="h-5 md:ml-4" />
        </button>
      </div>
      <div id="download-error" aria-live="polite" aria-atomic="true">
        {formState.success ? (
          <Link className="mt-2 text-sm text-blue-500 dark:text-white" href={`${formState?.message}`}>Download</Link>
        ) : (
          <p className="mt-2 text-sm text-red-500">{formState?.message}</p>
        )}
      </div>
    </form>
  );
}
