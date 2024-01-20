require('dotenv').config();
const authorize = require('./googleAuth');
const fetchTasks = require('./fetchRequests');
const addToDatabase = require('./addTasksNotionDb');
const queryDatabase = require('./queryNotionDb');
const databaseId = process.env.NOTION_DATABASE_ID;

async function handleTask(TitleId, Title, Details, Status, Deadline, CreatedDate, Completion) {
  try {
      const pageId = await queryDatabase(databaseId, TitleId);
      if (!pageId) {
          await addToDatabase(databaseId, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
          console.log('Task added to the database');
      } else {
          console.log('Task already exists in the database');
      }
  } catch (error) {
      console.error(error);
  }
}

authorize()
  .then(fetchTasks)
  .then(tasks => {
    tasks.forEach((task) => {
      const TitleId = task.id;
      const Title = task.title;
      const Details = task.notes || '';
      const Status = task.status;
      const CreatedDate = task.updated.split('T')[0]; // Extract date from updated timestamp
      const Deadline = task.due ? task.due.split('T')[0] : CreatedDate; // Use due date if available, else use created date
      const Completion = Status === 'completed';
      handleTask(TitleId, Title, Details, Status, Deadline, CreatedDate, Completion);
    });
  })
  .catch(console.error);