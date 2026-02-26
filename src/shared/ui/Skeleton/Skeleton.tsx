import styles from './Skeleton.module.css'

interface SkeletonLineProps {
  width?: string
  height?: number
}

interface SkeletonBlockProps {
  aspectRatio?: string
  borderRadius?: string
}

export const SkeletonLine = ({ width = '100%', height = 16 }: SkeletonLineProps) => (
  <div className={styles.shimmer} style={{ width, height, borderRadius: 4 }} />
)

export const SkeletonBlock = ({ aspectRatio = '1/1', borderRadius = '8px' }: SkeletonBlockProps) => (
  <div className={styles.shimmer} style={{ width: '100%', aspectRatio, borderRadius }} />
)
