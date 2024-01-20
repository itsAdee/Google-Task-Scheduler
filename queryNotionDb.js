//import necessary modules
const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
//load environment variables from .env file
dotenv.config();
//initialize Notion client with API key from environment variables
const notion = new Client({ auth: process.env.NOTION_API_KEY });
//get the database ID from the environment variables
const databaseId = process.env.NOTION_DATABASE_ID;

//query the database by taking in the database ID and task ID to check if the task already exists in the database
async function queryDatabase(databaseId, TaskId) {
    try {
        const response = await notion.databases.query({
            //pass in the database ID and filter the database by the task ID
            database_id: databaseId,
            filter: {
                //filter the database by the ID property
                property: "ID",
                title: {
                    //check if the ID property is equal to the task ID
                    equals: TaskId
                }
            }
        });
        //return the first result if it exists, else return null
        return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
        //throw an error if the request fails
        console.error(error.body);
    }
}

//export the queryDatabase function
module.exports = queryDatabase;