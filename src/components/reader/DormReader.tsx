import { FC, useRef, useState } from "react";
import * as XLSX from "xlsx";

const indexesToRemove: number[] = []; // Пока не удаляем ни одной колонки

export const DormReader: FC = () => {
    const [tableHTML, setTableHTML] = useState<string>("");
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = function (event) {
            const data = new Uint8Array(event.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: "array" });

            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const excelJson = XLSX.utils.sheet_to_json<any[]>(firstSheet, {
                header: 1,
            });

            renderTable(excelJson);
        };
        reader.readAsArrayBuffer(file);
        fileInputRef.current!.value = "";
    };

    const renderTable = (data: any[][]) => {
        const headerIndex = data.findIndex((row) =>
            row.includes("№ терминала")
        );
        if (headerIndex === -1) {
            setTableHTML("<p class='text-red-500'>Заголовки не найдены</p>");
            return;
        }

        const headers = data[headerIndex].filter(
            (_, index) => !indexesToRemove.includes(index)
        );
        const body = data.slice(headerIndex + 1).filter(
            (row) => row.length > 0 && !row.includes("ИТОГО")
        );

        const headLength = headers.length;
        let html = "<table class='table-auto w-full border mt-4 text-sm'>";

        // Thead
        html += "<thead><tr>";
        headers.forEach((head) => {
            html += `<th class='border px-4 py-2 bg-gray-100'>${head}</th>`;
        });
        html += "</tr></thead>";

        // Tbody
        html += "<tbody>";
        body.forEach((row) => {
            const filteredRow = row.filter(
                (_, index) => !indexesToRemove.includes(index)
            );
            if (filteredRow.length !== headLength) return;

            html += "<tr>";
            filteredRow.forEach((cell) => {
                html += `<td class='border px-4 py-2 align-top'>${
                    typeof cell === "string" ? cell : String(cell)
                }</td>`;
            });
            html += "</tr>";
        });
        html += "</tbody></table>";

        setTableHTML(html);
    };

    return (
        <div className="mx-auto mt-4 lg:mt-10 p-4 lg:p-6 bg-white rounded-xl">
            <h2 className="text-xl lg:text-2xl font-bold mb-4 text-center text-[#006799]">
                Загрузить файл Excel - Dormitory
            </h2>

            {fileName && (
                <p className="text-center mt-4 text-gray-600 text-sm lg:text-base">
                    <span className="font-medium">Selected file: <span className={"font-bold"}>{fileName}</span></span>
                </p>
            )}

            <label className="block text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFile}
                    className="mx-auto block w-full text-xs lg:text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-xs lg:file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100
                        cursor-pointer"
                />
            </label>

            <div
                className="mt-6 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: tableHTML }}
            />
        </div>
    );
};
