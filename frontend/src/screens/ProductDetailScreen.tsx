import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {ScreenName} from '../types/navigation';

interface Props {
  go: (screen: ScreenName) => void;
}

export const ProductDetailScreen: React.FC<Props> = ({go}) => {
  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => go('sharedItems')}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>컴공 전공책</Text>
        <View style={styles.creditBadge}>
          <Text style={styles.creditBadgeText}>1,250 크레딧</Text>
        </View>
      </View>

      <ScrollView>
        {/* 이미지 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.imageBox} />
          <View style={[styles.imageBox, {opacity: 0.7}]} />
        </ScrollView>

        <View style={styles.bodyPadding}>
          {/* 판매자 정보 */}
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={{fontSize: 20}}>:)</Text>
            </View>
            <Text style={styles.sellerName}>김나현</Text>
            <TouchableOpacity
              onPress={() => go('productEdit')}
              style={{marginLeft: 'auto'}}>
              <Text style={styles.editLink}>수정하기</Text>
            </TouchableOpacity>
          </View>

          {/* 제목 */}
          <Text style={styles.itemName}>컴공 전공책</Text>
          <Text style={styles.itemCategory}>도서</Text>

          {/* 설명 */}
          <Text style={styles.itemDesc}>
            {'전공 평점 4.48 학생이 쓰던 책입니다.\n메모 많이 적었어요.\n취업해서 팔아요.'}
          </Text>

          {/* 가격 */}
          <Text style={styles.itemPrice}>1,500 크레딧</Text>
        </View>
      </ScrollView>

      {/* 채팅하기 버튼 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => go('chatDetail')}>
          <Text style={styles.chatButtonText}>채팅하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  backArrow: {
    fontSize: 18,
    color: '#1A1A1A',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  creditBadge: {
    backgroundColor: '#EAF2E9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  creditBadgeText: {
    color: '#5C8B5A',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageBox: {
    width: 200,
    height: 220,
    backgroundColor: '#DDDDDD',
    marginRight: 2,
  },
  bodyPadding: {
    padding: 16,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  editLink: {
    fontSize: 13,
    color: '#888888',
    textDecorationLine: 'underline',
    marginLeft: 'auto',
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 13,
    color: '#888888',
    marginBottom: 12,
  },
  itemDesc: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 22,
    marginBottom: 24,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5C8B5A',
    textAlign: 'right',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  chatButton: {
    backgroundColor: '#5C8B5A',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});