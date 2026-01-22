import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { products, Product, getProductsByCategory } from '../data/products';
import ProductCard from '../components/ProductCard';
import { ManuscriptColors, ManuscriptFonts, BorderPatterns } from '../components/ManuscriptConstants';

export default function PharmacyScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | Product['category']>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories: { key: 'all' | Product['category']; label: string; icon: string }[] = [
    { key: 'all', label: 'All', icon: 'grid' },
    { key: 'herb', label: 'Herbs', icon: 'leaf' },
    { key: 'oil', label: 'Oils', icon: 'water' },
    { key: 'powder', label: 'Powders', icon: 'flask' },
    { key: 'tea', label: 'Teas', icon: 'cafe' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : getProductsByCategory(selectedCategory);

  // Product detail view
  if (selectedProduct) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedProduct(null)}
          >
            <Ionicons name="arrow-back" size={24} color={ManuscriptColors.vermillion} />
            <Text style={styles.backButtonText}>Back to Pharmacy</Text>
          </TouchableOpacity>

          <ProductCard product={selectedProduct} showFullDetails={true} />
        </ScrollView>
      </View>
    );
  }

  // Main pharmacy browse view
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Ayurvedic Pharmacy</Text>
        <Text style={styles.subtitle}>Trusted herbs & supplements</Text>
        <View style={styles.decorativeDivider}>
          <Text style={styles.decorativeSymbol}>{BorderPatterns.lotus}</Text>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Ionicons
              name={category.icon as any}
              size={18}
              color={selectedCategory === category.key ? '#FFFFFF' : ManuscriptColors.inkBrown}
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.key && styles.categoryTextActive
            ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Count */}
      <View style={styles.countContainer}>
        <Text style={styles.countText}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedProduct(item)}>
            <ProductCard product={item} showFullDetails={false} />
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
  header: {
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
    backgroundColor: ManuscriptColors.parchment,
    borderBottomWidth: 2,
    borderBottomColor: ManuscriptColors.goldLeaf,
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
    marginBottom: 8,
  },
  decorativeDivider: {
    alignItems: 'center',
    marginTop: 8,
  },
  decorativeSymbol: {
    fontSize: 24,
    color: ManuscriptColors.turmeric,
  },
  categoryScroll: {
    flexGrow: 0,
    flexShrink: 0,
    backgroundColor: ManuscriptColors.oldPaper,
    borderBottomWidth: 1,
    borderBottomColor: ManuscriptColors.copperBrown,
  },
  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: ManuscriptColors.parchment,
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
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    fontWeight: '600',
    marginLeft: 6,
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: ManuscriptColors.oldPaper,
  },
  countText: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
  },
  backButtonText: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    fontWeight: '600',
    color: ManuscriptColors.vermillion,
    marginLeft: 8,
  },
});
