'use client'

import { 
  TwitterShareButton, 
  FacebookShareButton,
  LinkedinShareButton,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon
} from 'react-share'

interface ShareButtonsProps {
  url: string
  title: string
  description: string
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${url}`
  
  return (
    <div className="flex space-x-2">
      <TwitterShareButton url={fullUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      
      <FacebookShareButton url={fullUrl} quote={description}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      
      <LinkedinShareButton url={fullUrl} title={title} summary={description}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  )
} 