// Import required modules
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
// Load environment variables from .env file
dotenv.config();
// Initialize Notion client with API key from environment variables
const notion = new Client({ auth: process.env.NOTION_API_KEY });
// Get the database ID from the environment variables
const databaseId = process.env.NOTION_DATABASE_ID;

//Adds a task to the database by taking in the database ID, task list name, task ID, task title, task details, task status, task deadline, task created date, and task completion status
async function addToDatabase(databaseId,TaskListName,TitleId ,Title, Details, Status, Deadline ,CreatedDate, Completion) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                //Set the properties of the task
                'ID': {
                    type: 'title',
                    title: [
                    {
                        type: 'text',
                        text: {
                            content: TitleId,
                        },
                    },
                    ],
                },
                'Details':{
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: Details,
                        },
                    },
                    ],
                },
                'Title' : {
                        type: 'rich_text',
                        rich_text: [
                        {
                            type: 'text',
                            text: {
                                content: Title,
                            },
                        }
                        ],
                },
                'Status': {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: Status,
                        },
                    },
                    ],
                },
                'Deadline': { // Date is formatted as YYYY-MM-DD or null
                    type: 'date',
                    date: {
                        start: CreatedDate,
                        end:Deadline

                    }
                },
                'Completion': {
                    type: 'checkbox',
                    checkbox: Completion
                },
                'Task List Name': {
                    type: 'rich_text',
                    rich_text: [
                    {
                        type: 'text',
                        text: {
                            content: TaskListName,
                        },
                    },
                    ],
                },
            }    
        });
        
    } catch (error) {
        //If there is an error, log the error
        console.error(error.body);
    }
}

//Export the addToDatabase function
module.exports = addToDatabase;
