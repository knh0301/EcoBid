import React from 'react';
import {SimpleListPage} from '../components/SimpleListPage';

export function LikedItemsScreen({navigation}: any) {
  return (
    <SimpleListPage
      title="마음에 들어요"
      subtitle="내가 찜한 물품들을 확인해보세요."
      navigation={navigation}
    />
  );
}