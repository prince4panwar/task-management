const ExcelJS = require("exceljs");
const Todo = require("../models/Todo");

/**
 * @desc    Export todos to Excel
 * @route   GET /api/todos/export/excel
 * @access  Private
 */
const exportTodosToExcel = async (req, res) => {
  try {
    const userId = req.userId;

    // 1️⃣ Fetch todos
    const todos = await Todo.find({ userId }).lean();

    if (!todos.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found to export",
      });
    }

    // 2️⃣ Create workbook & worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tasks");

    // 3️⃣ Define columns
    worksheet.columns = [
      { header: "S.No", key: "serial", width: 8 },
      { header: "Title", key: "title", width: 30 },
      { header: "Description", key: "description", width: 40 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Due Date", key: "dueDate", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    // 4️⃣ Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // 5️⃣ Add data rows
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

    // 6️⃣ Set response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=tasks_${Date.now()}.xlsx`
    );

    // 7️⃣ Write file to response
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
