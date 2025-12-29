const cron = require("node-cron");
const Todo = require("../models/Todo.js");
const Notification = require("../models/Notification.js");
const sender = require("../config/notification.js");

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "https://task-management-frontend-seven-jet.vercel.app";

const setupJobs = (io) => {
  cron.schedule("*/10 * * * * *", async () => {
    try {
      const now = new Date();
      now.setSeconds(0, 0);

      console.log("Checking for due tasks...");

      const unCompletedTasks = await Todo.find({
        dueDate: { $lte: now },
        status: { $in: ["pending", "in-progress"] },
        isOverdueNotified: false,
      }).populate("userId");

      console.log("Uncompleted tasks found:", unCompletedTasks.length);

      for (const task of unCompletedTasks) {
        if (!task.dueDate) continue;

        const taskLink = `${FRONTEND_URL}/todos/${task._id}`;

        if (!task.isOverdueNotified) {
          await Notification.create({
            type: "OVERDUE_TASK",
            userId: task.userId._id,
            todoId: task._id,
            title: task.title,
            status: task.status,
            dueDate: task.dueDate,
            priority: task.priority,
            created: task.createdAt,
            description: task.description,
          });

          io.to(task.userId._id.toString()).emit("overdue-task", {
            taskId: task._id,
            title: task.title,
            dueDate: task.dueDate,
            created: task.createdAt,
          });

          task.isOverdueNotified = true;
          await task.save();
        }

        if (!task.isEmailNotificationSent) {
          try {
            await sender.sendMail({
              to: task.userId.email,
              subject: `⏰ Task Due: ${task.title}`,
              text: `Your task "${task.title}" is due now. View task: ${taskLink}`,
              html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
                  <div style="max-width:450px; margin:auto; background:#ffffff; padding:20px; border-radius:10px; text-align:center;">
                    
                    <h2 style="color:#e11d48; margin:0;">⏰ Task Reminder</h2>

                    <p style="font-size:15px; color:#444;">
                      Hi ${task.userId.name || "User"}, your task
                      <strong>"${task.title}"</strong> is due now.
                    </p>

                    <p style="font-size:14px; color:#555; margin-top:8px;">
                      <strong>Due Date:</strong> ${task.dueDate.toLocaleString()}
                    </p>

                    <a 
                      href="${taskLink}" 
                      style="
                        display:inline-block;
                        margin-top:18px;
                        padding:10px 18px;
                        background:#2563eb;
                        color:#ffffff;
                        text-decoration:none;
                        border-radius:6px;
                        font-size:14px;
                        font-weight:600;
                      "
                      target="_blank"
                    >
                      🔗 View Task
                    </a>

                    <p style="margin-top:18px; color:#666; font-size:13px;">
                      Please take action soon.
                    </p>

                  </div>
                </body>
              </html>
            `,
            });

            task.isEmailNotificationSent = true;
            await task.save();

            console.log(`Email sent for task: ${task.title}`);
          } catch (emailError) {
            console.log("Email error:", emailError.message);
          }
        }
      }
    } catch (error) {
      console.log("Cron job error:", error.message);
    }
  });
};

module.exports = setupJobs;
