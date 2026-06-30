'use server';

import { revalidatePath } from 'next/cache';
import { client } from '@/sanity/client';

export async function approveSubscription(subId: string) {
    await client.patch(subId).set({ status: 'Approved' }).commit();
    revalidatePath('/admin/dashboard');
}

export async function rejectSubscription(subId: string) {
    await client.patch(subId).set({ status: 'Rejected' }).commit();
    revalidatePath('/admin/dashboard');
}

export async function deleteSubscription(subId: string) {
    await client.delete(subId);
    revalidatePath('/admin/dashboard');
}
