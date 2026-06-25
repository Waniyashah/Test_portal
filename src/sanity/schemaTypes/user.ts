export const userType = {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
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
            name: 'password',
            title: 'Hashed Password',
            type: 'string',
            hidden: true, // Hide from Studio UI
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
