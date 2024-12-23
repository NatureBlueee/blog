export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          status: 'draft' | 'published'
          author_id: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
          views: number
        }
        Insert: Omit<
          Database['public']['Tables']['posts']['Row'],
          'id' | 'created_at' | 'updated_at' | 'views'
        >
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      authors: {
        Row: {
          id: string
          name: string
          avatar: string | null
          bio: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['authors']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['authors']['Insert']>
      }
    }
  }
}
