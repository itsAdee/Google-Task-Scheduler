require('dotenv').config();
const authorize = require('./googleAuth');
const fetchTasks = require('./fetchRequests');
const addToDatabase = require('./addTasksNotionDb');
const queryDatabase = require('./queryNotionDb');
const cron = require('node-cron');
const databaseId = process.env.NOTION_DATABASE_ID;

async function handleTask(TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion) {
  try {
      const pageId = await queryDatabase(databaseId, TitleId);
      if (!pageId) {
          await addToDatabase(databaseId, TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
          console.log(`Task ${TitleId} added in the database`);
      } else {
          console.log(`Task ${TitleId} already exists in the database`);
      }
  } catch (error) {
      console.error(error);
  }
}

async function CheckTasks() {
  try {
    const taskLists = await authorize().then(fetchTasks);
    for (const [TaskListName, tasks] of Object.entries(taskLists)) {
      tasks.forEach((task) => {
        const TitleId = task.id;
        const Title = task.title;
        const Details = task.notes || '';
        const Status = task.status;
        const CreatedDate = task.updated.split('T')[0]; // Extract date from updated timestamp
        const Deadline = task.due ? task.due.split('T')[0] : CreatedDate; // Use due date if available, else use created date
        const Completion = Status === 'completed';
        handleTask(TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Schedule tasks to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
  console.log(`Running task at ${new Date().toISOString()}`);
  CheckTasks();
});