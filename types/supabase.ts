// types/supabase.ts

export type Post = {
    id: number
    title: string
    url: string
    points: number
    author: string
    time: string
    comments_count: number
}

export type Comment = {
    id: number
    post_id: number
    author: string
    content: string
    time: string
    reply_to?: number | null
}
