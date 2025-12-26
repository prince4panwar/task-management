import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { Spinner } from "./ui/spinner";
import toast from "react-hot-toast";
import { BASE_URL } from "@/config/api";

const exportExcel = async () => {
  const response = await axios.get(`${BASE_URL}/api/todos/export/excel`, {
    responseType: "blob",
    headers: {
      "x-access-token": localStorage.getItem("token"),
    },
  });

  return response.data;
};

function ExportExcelButton() {
  const { mutate, isPending } = useMutation({
    mutationFn: exportExcel,
    onSuccess: (data) => {
      toast.success("Tasks exported successfully");
      // Create downloadable file
      const url = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks.xlsx");
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Excel export failed", error);
      toast.success("Failed to export Excel file");
    },
  });

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded shadow transition cursor-pointer"
    >
      {isPending ? (
        <>
          <Spinner className="size-5" />
          Exporting...
        </>
      ) : (
        <>
          <Download size={18} />
          Export
        </>
      )}
    </button>
  );
}

export default ExportExcelButton;
