/**
 * DailyInsight Component
 *
 * Shows a rotating daily blog/article teaser to encourage app engagement.
 * Content changes each day to keep users curious and returning.
 * Uses blogs from the Learn section (blogs.ts)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { ManuscriptColors } from './ManuscriptConstants';
import { blogPosts } from '../data/blogs';

// Map categories to icons
const CATEGORY_ICONS: { [key: string]: string } = {
  'Digital Wellness': 'cellphone-off',
  'Energy & Vitality': 'lightning-bolt',
  'Mental Health': 'head-dots-horizontal',
  'Daily Routine': 'weather-sunset-up',
  'Nutrition': 'food-variant',
  'Herbs & Spices': 'leaf',
  'Self-Care': 'bottle-tonic',
  'Sleep & Rest': 'sleep',
  'Digestion': 'stomach',
  'Basics': 'school',
  'Mindfulness': 'meditation',
};

// Helper to get icon for a category
const getIconForCategory = (category: string): string => {
  return CATEGORY_ICONS[category] || 'book-open-page-variant';
};

// Helper to clean title (remove emojis at the start)
const cleanTitle = (title: string): string => {
  return title.replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '');
};

interface DailyInsightProps {
  onPress?: () => void;
}

export default function DailyInsight({ onPress }: DailyInsightProps) {
  const navigation = useNavigation<any>();
  const [showModal, setShowModal] = useState(false);

  // Get today's blog based on day of year
  const getDailyBlog = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return blogPosts[dayOfYear % blogPosts.length];
  };

  const blog = getDailyBlog();
  const icon = getIconForCategory(blog.category);

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowModal(true)}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={icon as any}
            size={24}
            color={ManuscriptColors.vermillion}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.category}>{blog.category}</Text>
          <Text style={styles.headline} numberOfLines={2}>{cleanTitle(blog.title)}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={ManuscriptColors.fadedInk} />
      </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Ionicons name="close" size={24} color={ManuscriptColors.inkBlack} />
            </TouchableOpacity>

            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons
                name={icon as any}
                size={40}
                color={ManuscriptColors.vermillion}
              />
            </View>

            <Text style={styles.modalCategory}>{blog.category}</Text>
            <Text style={styles.modalHeadline}>{cleanTitle(blog.title)}</Text>
            <Text style={styles.modalPreview}>{blog.excerpt}</Text>

            <View style={styles.readTime}>
              <Ionicons name="time-outline" size={16} color={ManuscriptColors.fadedInk} />
              <Text style={styles.readTimeText}>{blog.readTime} read</Text>
            </View>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => {
                setShowModal(false);
                // Navigate to Blog tab, then to BlogMain with blogId
                navigation.navigate('Blog', {
                  screen: 'BlogMain',
                  params: { blogId: blog.id },
                });
              }}
            >
              <Text style={styles.dismissButtonText}>Read Full Article</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ManuscriptColors.copperBrown,
    borderLeftWidth: 4,
    borderLeftColor: ManuscriptColors.vermillion,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(227, 66, 52, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  category: {
    fontSize: 11,
    color: ManuscriptColors.vermillion,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  headline: {
    fontSize: 14,
    fontWeight: '600',
    color: ManuscriptColors.inkBlack,
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ManuscriptColors.parchment,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(227, 66, 52, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalCategory: {
    fontSize: 12,
    color: ManuscriptColors.vermillion,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalHeadline: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 28,
  },
  modalPreview: {
    fontSize: 15,
    color: ManuscriptColors.inkBrown,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  readTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 6,
  },
  readTimeText: {
    fontSize: 13,
    color: ManuscriptColors.fadedInk,
  },
  dismissButton: {
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dismissButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
