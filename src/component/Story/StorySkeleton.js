import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

export default StorySkeleton = () => {
  return (
    <SkeletonPlaceholder backgroundColor={global.colorSecondary} highlightColor='#FFFFFF'>
      <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
        <SkeletonPlaceholder.Item marginLeft={7} width={110} height={160} borderRadius={15} />
        <SkeletonPlaceholder.Item marginLeft={7} width={110} height={160} borderRadius={15} />
        <SkeletonPlaceholder.Item marginLeft={7} width={110} height={160} borderRadius={15} />
        <SkeletonPlaceholder.Item marginLeft={7} width={110} height={160} borderRadius={15} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};