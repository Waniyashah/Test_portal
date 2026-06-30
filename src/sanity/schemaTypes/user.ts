export const userType = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'clerkId',
            title: 'Clerk User ID',
            type: 'string',
            description: 'The unique ID from Clerk authentication — do not edit manually.',
            readOnly: true,
        },
        {
            name: 'name',
            title: 'Full Name',
            type: 'string',
        },
        {
            name: 'email',
            title: 'Email',
            type: 'string',
        },
        {
            name: 'role',
            title: 'Role',
            type: 'string',
            options: {
                list: [
                    { title: 'Student', value: 'student' },
                    { title: 'Teacher', value: 'teacher' },
                    { title: 'Admin', value: 'admin' },
                ],
            },
            initialValue: 'student',
        },
        {
            name: 'status',
            title: 'Teacher Approval Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Approved', value: 'approved' },
                    { title: 'Pending Approval', value: 'pending' },
                    { title: 'Rejected', value: 'rejected' },
                ],
            },
            hidden: ({ document }: any) => document?.role !== 'teacher',
        },
    ],
};
