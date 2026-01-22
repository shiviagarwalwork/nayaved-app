import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { blogPosts } from '../data/blogs';
import ManuscriptCard from '../components/ManuscriptCard';
import { ManuscriptColors, ManuscriptFonts, BorderPatterns } from '../components/ManuscriptConstants';

export default function BlogScreen() {
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState<any>(null);

  const categories = ['All', 'Herbs & Spices', 'Daily Routine', 'Mental Health', 'Basics'];

  const filteredBlogs = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter((blog: any) => blog.category === selectedCategory);

  if (selectedBlog) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setSelectedBlog(null)}
        >
          <Text style={styles.backButtonText}>← Back to Articles</Text>
        </TouchableOpacity>

        <ManuscriptCard ornament="lotus">
          <View style={styles.blogHeader}>
            <Text style={styles.blogCategory}>{selectedBlog.category}</Text>
            <View style={styles.titleDecoration}>
              <Text style={styles.decorativeSymbol}>{BorderPatterns.ornament}</Text>
              <Text style={styles.blogTitle}>{selectedBlog.title}</Text>
              <Text style={styles.decorativeSymbol}>{BorderPatterns.ornament}</Text>
            </View>
            <Text style={styles.blogMeta}>
              {selectedBlog.author} • {selectedBlog.publishedDate} • {selectedBlog.readTime}
            </Text>
          </View>

          <Text style={styles.blogContent}>{selectedBlog.content}</Text>
        </ManuscriptCard>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Learn Ayurveda</Text>
        <Text style={styles.subtitle}>Ancient wisdom for modern life</Text>
      </View>

      {/* Body Map Feature */}
      <TouchableOpacity
        style={styles.bodyMapFeature}
        onPress={() => navigation.navigate('BodyMap')}
      >
        <View style={styles.bodyMapIcon}>
          <MaterialCommunityIcons name="human" size={28} color={ManuscriptColors.indigo} />
        </View>
        <View style={styles.bodyMapText}>
          <Text style={styles.bodyMapTitle}>Interactive Body Map</Text>
          <Text style={styles.bodyMapSubtitle}>Learn which doshas govern each body part</Text>
        </View>
        <Feather name="chevron-right" size={20} color={ManuscriptColors.fadedInk} />
      </TouchableOpacity>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.categoryTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Blog List */}
      <FlatList
        data={filteredBlogs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedBlog(item)}
            style={styles.blogCardTouchable}
          >
            <ManuscriptCard ornament="leaf" style={styles.blogCard}>
              <View style={styles.blogCardHeader}>
                <Text style={styles.cardCategory}>{item.category}</Text>
                <Text style={styles.cardReadTime}>{item.readTime}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardExcerpt} numberOfLines={2}>
                {item.excerpt}
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardAuthor}>{item.author}</Text>
                <Text style={styles.cardDate}>{item.publishedDate}</Text>
              </View>
            </ManuscriptCard>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ManuscriptColors.palmLeaf,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: ManuscriptFonts.titleSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  bodyMapFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: ManuscriptColors.indigo,
  },
  bodyMapIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ManuscriptColors.oldPaper,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bodyMapText: {
    flex: 1,
  },
  bodyMapTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: ManuscriptColors.indigo,
    marginBottom: 2,
  },
  bodyMapSubtitle: {
    fontSize: 12,
    color: ManuscriptColors.fadedInk,
  },
  categoryScroll: {
    flexGrow: 0,
    flexShrink: 0,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: ManuscriptColors.vermillion,
    borderColor: ManuscriptColors.vermillion,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  blogCardTouchable: {
    marginBottom: 12,
  },
  blogCard: {
    marginBottom: 0,
  },
  blogCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardCategory: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.vermillion,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  cardReadTime: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
  },
  cardTitle: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    marginBottom: 8,
  },
  cardExcerpt: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardAuthor: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  cardDate: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
  },
  backButton: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  backButtonText: {
    color: ManuscriptColors.vermillion,
    fontSize: 16,
    fontFamily: ManuscriptFonts.body,
    fontWeight: '600',
  },
  blogHeader: {
    marginBottom: 16,
  },
  blogCategory: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.vermillion,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    textAlign: 'center',
  },
  titleDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  decorativeSymbol: {
    fontSize: 20,
    color: ManuscriptColors.turmeric,
    marginHorizontal: 8,
  },
  blogTitle: {
    fontSize: ManuscriptFonts.headingSize,
    fontWeight: 'bold',
    fontFamily: ManuscriptFonts.heading,
    color: ManuscriptColors.inkBlack,
    textAlign: 'center',
  },
  blogMeta: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  blogContent: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    lineHeight: 26,
  },
});
