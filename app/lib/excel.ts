import * as XLSX from "xlsx";
import * as fs from "fs";
import { formatDateTimeLocal } from "@/app/lib/utils";

export default async function createExcel({
  title,
  sheetName,
  datas,
}: {
  title?: string;
  sheetName?: string;
  datas?: any[];
}) {
  XLSX.set_fs(fs);

  try {
    if (datas && Array.isArray(datas)) {
      // Create excel file
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet([{ A: `[${title}]` }], {
        skipHeader: true,
      });
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.utils.sheet_add_json(ws, datas, { origin: 3 });

      // Save Excel file
      const fileName =
        process.env.NEXT_PUBLIC_DOWNLOAD +
        "/" +
        formatDateTimeLocal("") +
        `-${title}.xlsx`;
      XLSX.writeFile(wb, `public${fileName}`);
      return { success: true, message: `${fileName}` };
    }
  } catch (error) {
    console.debug("#================== Export Error : ", error);
    return null;
  }
}
