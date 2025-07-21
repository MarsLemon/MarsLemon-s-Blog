import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface Author {
  name: string;
  avatar: string;
}

interface Post {
  title: string;
  excerpt: string;
  date: string;
  author: Author;
  coverImage: string;
  slug: string;
}

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="relative h-[500px] w-full">
        <Image
          src={post.coverImage || '/placeholder.svg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </span>
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-1 h-3 w-3" />
            {post.date}
          </div>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-3">{post.title}</h1>
        <p className="text-sm md:text-base mb-6 max-w-2xl text-gray-200">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={post.author?.avatar || '/placeholder.svg'}
                alt={post.author?.name}
              />
              <AvatarFallback>{post.author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{post.author?.name}</span>
          </div>
          <Link href={`/blog/${post.slug}`}>
            <Button variant="secondary">Read More</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
