import Image from 'next/image'
import { cn } from '@/utils/cn'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({
  src,
  alt,
  width = 800,
  height = 400,
  className,
  priority = false
}: OptimizedImageProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="object-cover"
        priority={priority}
      />
    </div>
  )
} 