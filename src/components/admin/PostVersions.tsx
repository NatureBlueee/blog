interface PostVersionsProps {
  versions: VersionMetadata[]
  onVersionSelect: (versionId: string) => void
}

export function PostVersions({ versions, onVersionSelect }: PostVersionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">历史版本</h3>
      <div className="space-y-2">
        {versions.map(version => (
          <button
            key={version.id}
            onClick={() => onVersionSelect(version.id)}
            className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(version.timestamp).toLocaleString()}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                {version.type === 'auto' ? '自动保存' : '手动保存'}
              </span>
            </div>
            {version.description && (
              <p className="text-sm mt-1">{version.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  )
} 