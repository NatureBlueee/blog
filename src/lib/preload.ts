export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export const preloadImages = async (srcs: string[]): Promise<void[]> => {
  const promises = srcs.map(preloadImage)
  return Promise.all(promises)
}

export const preloadNextPageImages = async (nextPageUrls: string[]) => {
  try {
    // 获取下一页的图片URL
    const imageUrls = await fetchNextPageImageUrls(nextPageUrls)
    // 后台预加载
    preloadImages(imageUrls).catch(() => {
      // 静默失败，不影响用户体验
    })
  } catch (error) {
    console.error('Failed to preload next page images:', error)
  }
}

async function fetchNextPageImageUrls(pageUrls: string[]): Promise<string[]> {
  // 实现获取页面中图片URL的逻辑
  // 这里需要根据实际项目情况来实现
  return []
} 