import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../data/products';
import ManuscriptCard from './ManuscriptCard';
import { ManuscriptColors, ManuscriptFonts } from './ManuscriptConstants';

interface ProductCardProps {
  product: Product;
  showFullDetails?: boolean;
}

export default function ProductCard({ product, showFullDetails = false }: ProductCardProps) {
  const handleBuyNow = () => {
    Alert.alert(
      'Open Affiliate Store?',
      `This will open ${product.brand}'s website where you can purchase ${product.name}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            Linking.openURL(product.affiliateLink).catch(() => {
              Alert.alert('Error', 'Could not open the link');
            });
          },
        },
      ]
    );
  };

  const categoryIcons = {
    herb: 'leaf',
    supplement: 'medical',
    oil: 'water',
    powder: 'flask',
    tea: 'cafe',
  };

  return (
    <ManuscriptCard ornament="leaf" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons
            name={categoryIcons[product.category] as any}
            size={24}
            color={ManuscriptColors.vermillion}
          />
          <View style={styles.headerText}>
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.brandName}>{product.brand}</Text>
          </View>
        </View>
        <Text style={styles.price}>{product.price}</Text>
      </View>

      <Text style={styles.description}>{product.description}</Text>

      {showFullDetails && (
        <>
          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Benefits:</Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Usage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use:</Text>
            <Text style={styles.usageText}>{product.usage}</Text>
          </View>

          {/* Doshas */}
          <View style={styles.doshaContainer}>
            <Text style={styles.doshaLabel}>Good for: </Text>
            {product.doshas.map((dosha, index) => (
              <View key={dosha} style={styles.doshaBadge}>
                <Text style={styles.doshaText}>
                  {dosha.charAt(0).toUpperCase() + dosha.slice(1)}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
        <Text style={styles.buyButtonText}>Buy Now</Text>
        <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        Affiliate link - We may earn a commission from purchases
      </Text>
    </ManuscriptCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  productName: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 2,
  },
  brandName: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
  },
  price: {
    fontSize: ManuscriptFonts.subheadingSize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.vermillion,
  },
  description: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    lineHeight: 22,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.heading,
    fontWeight: 'bold',
    color: ManuscriptColors.inkBlack,
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.vermillion,
    marginRight: 8,
  },
  benefitText: {
    flex: 1,
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    lineHeight: 20,
  },
  usageText: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.inkBrown,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  doshaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  doshaLabel: {
    fontSize: ManuscriptFonts.captionSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    marginRight: 8,
  },
  doshaBadge: {
    backgroundColor: ManuscriptColors.turmeric,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  doshaText: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ManuscriptColors.vermillion,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ManuscriptColors.goldLeaf,
    marginBottom: 8,
  },
  buyButtonText: {
    fontSize: ManuscriptFonts.bodySize,
    fontFamily: ManuscriptFonts.body,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  disclaimer: {
    fontSize: ManuscriptFonts.smallSize,
    fontFamily: ManuscriptFonts.body,
    color: ManuscriptColors.fadedInk,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
