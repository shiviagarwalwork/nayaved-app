import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ManuscriptColors, ManuscriptFonts, ManuscriptSpacing, BorderPatterns } from './ManuscriptConstants';

interface ManuscriptCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  ornament?: 'ornament' | 'leaf' | 'lotus' | 'om';
  style?: ViewStyle;
}

export default function ManuscriptCard({ children, title, subtitle, ornament = 'lotus', style }: ManuscriptCardProps) {
  const ornamentSymbol = ornament === 'ornament' ? BorderPatterns.ornament :
                         ornament === 'leaf' ? BorderPatterns.leaf :
                         ornament === 'om' ? BorderPatterns.om :
                         BorderPatterns.lotus;

  return (
    <View style={[styles.container, style]}>
      {/* Top border decoration */}
      <View style={styles.topBorder}>
        <Text style={styles.ornamentText}>{ornamentSymbol}</Text>
        <View style={styles.borderLine} />
        <Text style={styles.ornamentText}>{ornamentSymbol}</Text>
      </View>

      {/* Card content */}
      <View style={styles.contentContainer}>
        {title && (
          <Text style={styles.title}>{title}</Text>
        )}
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
        {children}
      </View>

      {/* Bottom border decoration */}
      <View style={styles.bottomBorder}>
        <Text style={styles.ornamentText}>{ornamentSymbol}</Text>
        <View style={styles.borderLine} />
        <Text style={styles.ornamentText}>{ornamentSymbol}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: ManuscriptColors.parchment,
    borderRadius: ManuscriptSpacing.borderRadius,
    borderWidth: 2,
    borderColor: ManuscriptColors.copperBrown,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  topBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: ManuscriptColors.goldLeaf,
  },
  bottomBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: ManuscriptColors.goldLeaf,
  },
  borderLine: {
    flex: 1,
    height: 1,
    backgroundColor: ManuscriptColors.goldLeaf,
    marginHorizontal: 8,
  },
  ornamentText: {
    fontSize: 16,
    color: ManuscriptColors.vermillion,
    fontFamily: ManuscriptFonts.decorative,
  },
  contentContainer: {
    padding: ManuscriptSpacing.padding.large,
  },
  title: {
    fontFamily: ManuscriptFonts.heading,
    fontSize: ManuscriptFonts.headingSize,
    color: ManuscriptColors.inkBlack,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.bodySize,
    color: ManuscriptColors.fadedInk,
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
});
