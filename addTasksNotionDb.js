const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function addToDatabase(databaseId,TitleId ,Title, Details, Status, Deadline ,CreatedDate, Completion) {
    try {
        const response = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
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
            }    
        });
        console.log(response);
    } catch (error) {
        console.error(error.body);
    }
}

addToDatabase(databaseId, "SnBPNDU1V0R0S1B0Wk9oZA'", "DO COMM Skills Revision", "Write 5 points", "needsAction", "2022-03-29", "2022-01-19",false);

module.exports = addToDatabase;
