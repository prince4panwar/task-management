const cron = require("node-cron");
const Todo = require("../models/Todo.js");
const sender = require("../config/notification.js");

const setupJobs = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      now.setSeconds(0, 0); // ignore seconds & ms for consistency
      console.log("Checking for due tasks...");

      const unCompletedTasks = await Todo.find({
        dueDate: { $lte: now }, // all past & current due dates
        status: { $in: ["pending", "in-progress"] },
        notificationSent: false,
      }).populate("userId");

      console.log("Uncompleted tasks found:", unCompletedTasks.length);

      for (const task of unCompletedTasks) {
        if (!task.dueDate) {
          console.log(`Skipping task "${task.title}" — missing dueDate`);
          continue;
        }

        try {
          await sender.sendMail({
            to: task.userId.email,
            subject: `⏰ Task Due: ${task.title}`,
            text: `Your task "${task.title}" is due now. Please complete it.`,
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
                    <p style="margin-top:18px; color:#666; font-size:13px;">
                      Please take action soon.
                    </p>
                  </div>
                </body>
              </html>
            `,
          });

          console.log(`Notification sent for task: ${task.title}`);

          task.notificationSent = true;
          await task.save();
        } catch (emailError) {
          console.log("Error sending email:", emailError.message);
        }
      }
    } catch (error) {
      console.log("Cron job error:", error.message);
    }
  });
};

module.exports = setupJobs;
