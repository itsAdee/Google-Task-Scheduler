// Author: Adeel Ahmed Qureshi (@itsAdee)
// Import modules
require('dotenv').config();
const authorize = require('./googleAuth');
const fetchTasks = require('./fetchRequests');
const addToDatabase = require('./addTasksNotionDb');
const queryDatabase = require('./queryNotionDb');
const cron = require('node-cron');
// Get the database ID from the environment variables
const databaseId = process.env.NOTION_DATABASE_ID;

// the function checks if the task already exists in the database, if not, it adds the task to the database
async function handleTask(TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion) {
  try {
    // Check if the task already exists in the database
      const pageId = await queryDatabase(databaseId, TitleId);
      if (!pageId) {
        // If the task does not exist in the database, add it to the database
          await addToDatabase(databaseId, TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
          console.log(`Task ${TitleId} added in the database`);
      } else {
        // If the task already exists in the database, log it
          console.log(`Task ${TitleId} already exists in the database`);
      }
  } catch (error) {
      console.error(error);
  }
}

// the function processes the tasks from the cache(task lists) and calls the handleTask function for each task
async function CheckTasks() {
  try {
    const taskLists = await authorize().then(fetchTasks);
    for (const [TaskListName, tasks] of Object.entries(taskLists)) {
      tasks.forEach((task) => {
        const TitleId = task.id;
        const Title = task.title;
        const Details = task.notes || '';
        const Status = task.status;
        // Extract date from updated timestamp
        const CreatedDate = task.updated.split('T')[0]; 
        // Use due date if available, else use created date
        const Deadline = task.due ? task.due.split('T')[0] : CreatedDate; 
        // Check if task is completed by checking the status
        const Completion = Status === 'completed';
        // Call handleTask function for each task
        handleTask(TaskListName, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Schedule tasks to run every 2 minutes
cron.schedule('*/2 * * * *', () => {
  // Log the time when the task is run
  console.log(`Running task at ${new Date().toLocaleTimeString()}`);
  CheckTasks();
});