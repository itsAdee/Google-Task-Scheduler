const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function queryDatabase(databaseId, TaskId) {
    try {
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: "ID",
                title: {
                    equals: TaskId
                }
            }
        });
        return response.results.length > 0 ? response.results[0] : null;
    } catch (error) {
        console.error(error.body);
    }
}

module.exports = queryDatabase;