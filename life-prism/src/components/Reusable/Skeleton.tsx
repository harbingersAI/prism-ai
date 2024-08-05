// components/Reusable/Skeleton.tsx

import React from 'react';
import styles from '@/styles/components/Reusable/Skeleton.module.scss';

interface SkeletonProps {
  height?: number | string;
  width?: number | string;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({ height, width, style }) => {
  return (
    <div
      className={styles.skeleton}
      style={{
        height,
        width,
        ...style,
      }}
    />
  );
};

export default Skeleton;