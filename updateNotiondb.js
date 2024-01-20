const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

async function updateDatabase(pageId, TitleId, Title, Details, Status, Deadline, CreatedDate, Completion) {
    try {
        const response = await notion.pages.update({
            page_id: pageId,
            properties: {
                'ID': {
                    title: [
                        {
                            text: {
                                content: TitleId,
                            },
                        },
                    ],
                },
                'Details': {
                    rich_text: [
                        {
                            text: {
                                content: Details,
                            },
                        },
                    ],
                },
                'Title': {
                    rich_text: [
                        {
                            text: {
                                content: Title,
                            },
                        },
                    ],
                },
                'Status': {
                    rich_text: [
                        {
                            text: {
                                content: Status,
                            },
                        },
                    ],
                },
                'Deadline': {
                    date: {
                        start: CreatedDate,
                        end: Deadline
                    }
                },
                'Completion': {
                    checkbox: Completion
                },
            }
        });
        console.log(response);
    } catch (error) {
        console.error(error.body);
    }
}

module.exports = updateDatabase;