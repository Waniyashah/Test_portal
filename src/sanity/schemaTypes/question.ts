export const questionType = {
    name: 'question',
    title: 'Question',
    type: 'document',
    fields: [
        {
            name: 'text',
            title: 'Question Text',
            type: 'text',
        },
        {
            name: 'options',
            title: 'Options',
            type: 'array',
            of: [
                {
                    type: 'object',
                    fields: [
                        { name: 'text', title: 'Option Text', type: 'string' },
                        { name: 'isCorrect', title: 'Is Correct?', type: 'boolean', initialValue: false }
                    ]
                }
            ]
        },
        {
            name: 'marks',
            title: 'Marks Override',
            type: 'number',
            description: 'Leave empty to use test default marks'
        }
    ],
};
