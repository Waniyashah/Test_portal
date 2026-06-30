import { client } from '@/sanity/client'

export async function getOrCreateSanityUser(clerkId: string, email: string, name: string) {
    // 1. Try to find by _id (Clerk ID)
    let user = await client.fetch(`*[_type == "user" && _id == $clerkId][0]`, { clerkId })
    if (user) return user

    // 2. Try to find by clerkId field
    user = await client.fetch(`*[_type == "user" && clerkId == $clerkId][0]`, { clerkId })
    if (user) return user

    // 3. Try to find by email (to link existing legacy users)
    user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email })
    if (user) {
        // Since we can't change _id, we can set clerkId field
        user = await client.patch(user._id).set({ clerkId }).commit()
        console.log(`Associated existing Sanity user (${user._id}) with Clerk ID: ${clerkId}`)
        return user
    }

    // 4. Create new user with _id as clerkId
    user = await client.create({
        _type: 'user',
        _id: clerkId,
        clerkId,
        name,
        email,
        role: 'student',
    })
    console.log(`JIT: Created Sanity user (${clerkId}) for Clerk ID`)
    return user
}
