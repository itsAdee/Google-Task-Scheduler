# Task Sync App

This application syncs tasks from Google Tasks to a Notion database. It periodically checks for new tasks in Google Tasks and adds them to the Notion database if they don't already exist.

## Environment Variables

The application uses the following environment variables, which are defined in a `.env` file:

- `NOTION_API_KEY`: The API key for the Notion API.
- `NOTION_DATABASE_ID`: The ID of the Notion database where tasks will be stored.
- `TASK_LIST_NAME`= The Name of the task List

These keys are crucial for the application to interact with the Notion API and the specific Task List ,Notion database.

## Google Authentication

The application uses Google's OAuth 2.0 flow for authentication. When you run the application, it will open a new browser window where you can choose the Google account you want to use. After you authorize the application, it will have access to your Google Tasks.

## Running the Application

To run the application, first install the dependencies with `npm install`. Then, start the application with `npm start`. The application will start checking for new tasks every 2 minutes.