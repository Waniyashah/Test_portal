export const subscriptionType = {
    name: 'subscription',
    title: 'Subscription Payment',
    type: 'document',
    fields: [
        {
            name: 'teacher',
            title: 'Teacher',
            type: 'reference',
            to: [{ type: 'user' }],
        },
        {
            name: 'planName',
            title: 'Plan Name',
            type: 'string',
        },
        {
            name: 'paymentMethod',
            title: 'Payment Method',
            type: 'string',
            options: { list: ['JazzCash', 'Easypaisa'] }
        },
        {
            name: 'paymentProof',
            title: 'Payment Proof Screenshot',
            type: 'image',
        },
        {
            name: 'status',
            title: 'Approval Status',
            type: 'string',
            options: {
                list: ['Pending Approval', 'Approved', 'Rejected']
            },
            initialValue: 'Pending Approval',
        },
        {
            name: 'submittedAt',
            title: 'Submitted At',
            type: 'datetime',
        }
    ],
};
