export const resultType = {
    name: 'result',
    title: 'Test Result',
    type: 'document',
    fields: [
        {
            name: 'test',
            title: 'Test',
            type: 'reference',
            to: [{ type: 'mcqTest' }],
        },
        {
            name: 'student',
            title: 'Student (Registered)',
            type: 'reference',
            to: [{ type: 'user' }],
        },
        {
            name: 'studentEmail',
            title: 'Student Email (Guest)',
            type: 'string',
        },
        {
            name: 'studentName',
            title: 'Student Name',
            type: 'string',
        },
        {
            name: 'totalMarksObtained',
            title: 'Total Marks Obtained',
            type: 'number',
        },
        {
            name: 'maxMarks',
            title: 'Maximum Marks',
            type: 'number',
        },
        {
            name: 'percentage',
            title: 'Percentage (%)',
            type: 'number',
        },
        {
            name: 'warningsIssued',
            title: 'Cheat Warnings Issued',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'remarks',
            title: 'Remarks',
            type: 'string',
        },
        {
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
        }
    ],
};
