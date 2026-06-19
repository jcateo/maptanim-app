import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CommunityHub() {
  const insets = useSafeAreaInsets();

  const posts = [
    {
      id: 1,
      author: 'Farmer John',
      content: 'Great harvest season this year! My tomato yield increased by 30%',
      likes: 24,
    },
    {
      id: 2,
      author: 'Sarah',
      content: 'Anyone else dealing with leaf spots? Share your solutions please',
      likes: 12,
    },
    {
      id: 3,
      author: 'David',
      content: 'Just started using the new planting methods. Will update soon!',
      likes: 18,
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community Hub</Text>
        <Text style={styles.headerSubtitle}>Share and learn from other farmers</Text>
      </View>
      <ScrollView style={styles.content}>
        {posts.map(post => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Text style={styles.postAuthor}>{post.author}</Text>
              <Text style={styles.postLikes}>❤️ {post.likes}</Text>
            </View>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  postLikes: {
    fontSize: 12,
    color: '#ef4444',
  },
  postContent: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
