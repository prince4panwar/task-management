const ExcelJS = require("exceljs");
const Todo = require("../models/Todo");

const exportTodosToExcel = async (req, res) => {
  try {
    const userId = req.userId;

    const todos = await Todo.find({ userId }).lean();

    if (!todos.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found to export",
      });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    worksheet.columns = [
      { header: "S.No", key: "serial", width: 8 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    todos.forEach((todo, index) => {
      worksheet.addRow({
        serial: index + 1,
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate
          ? new Date(todo.dueDate).toLocaleDateString()
          : "",
        createdAt: new Date(todo.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=tasks_${Date.now()}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Excel export failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export tasks to Excel",
    });
  }
};

module.exports = {
  exportTodosToExcel,
};
