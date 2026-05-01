import React from 'react';
import {GoToScreen} from '../types/navigation';
import {SimpleListPage} from '../components/SimpleListPage';

export function SharedItemsScreen({go}: {go: GoToScreen}) {
  return (
    <SimpleListPage
      title="나눔한 물품"
      subtitle="내가 다른 사람들과 나눈 물품들이에요."
      go={go}
    />
  );
}