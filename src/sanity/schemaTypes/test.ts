export const testType = {
    name: 'mcqTest',
    title: 'MCQ Test',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
        },
        {
            name: 'teacher',
            title: 'Teacher',
            type: 'reference',
            to: [{ type: 'user' }],
        },
        {
            name: 'durationOptions',
            title: 'Duration Configuration',
            type: 'object',
            fields: [
                { name: 'durationMinutes', title: 'Duration in Minutes', type: 'number' },
                { name: 'startTime', title: 'Scheduled Start Time', type: 'datetime' },
                { name: 'endTime', title: 'Scheduled End Time', type: 'datetime' }
            ]
        },
        {
            name: 'settings',
            title: 'Test Settings',
            type: 'object',
            fields: [
                { name: 'shuffleQuestions', title: 'Shuffle Questions', type: 'boolean', initialValue: false },
                { name: 'shuffleOptions', title: 'Shuffle Options', type: 'boolean', initialValue: false },
                { name: 'oneQuestionAtATime', title: 'One Question At a Time', type: 'boolean', initialValue: false },
                { name: 'showResultsToStudents', title: 'Show Results Status', type: 'boolean', initialValue: true },
                { name: 'antiCheatEnabled', title: 'Anti-Cheat Enabled', type: 'boolean', initialValue: true },
                { name: 'defaultMarks', title: 'Default Marks Per Question', type: 'number', initialValue: 1 }
            ]
        },
        {
            name: 'sections',
            title: 'Sections',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
                        {
                            name: 'questions',
                            title: 'Questions',
                            type: 'array',
                            of: [{ type: 'reference', to: [{ type: 'question' }] }]
                        }
                    ]
                }
            ]
        }
    ],
};
