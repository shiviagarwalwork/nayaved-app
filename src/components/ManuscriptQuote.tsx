import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ManuscriptColors, ManuscriptFonts, ManuscriptSpacing, BorderPatterns } from './ManuscriptConstants';

interface ManuscriptQuoteProps {
  quote: string;
  source?: string; // e.g., "Charaka Samhita, Sutrasthana 1.15"
  sanskrit?: string; // Optional Sanskrit transliteration
  style?: ViewStyle;
}

export default function ManuscriptQuote({ quote, source, sanskrit, style }: ManuscriptQuoteProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Left border decoration */}
      <View style={styles.leftBorder}>
        <Text style={styles.borderText}>{BorderPatterns.vertical}</Text>
      </View>

      {/* Quote content */}
      <View style={styles.quoteContent}>
        {/* Sanskrit text if provided */}
        {sanskrit && (
          <Text style={styles.sanskritText}>{sanskrit}</Text>
        )}

        {/* Opening quotation mark */}
        <Text style={styles.quoteMark}>"</Text>

        {/* Quote text */}
        <Text style={styles.quoteText}>{quote}</Text>

        {/* Closing quotation mark */}
        <Text style={styles.quoteMarkEnd}>"</Text>

        {/* Source citation */}
        {source && (
          <View style={styles.sourceContainer}>
            <Text style={styles.ornament}>{BorderPatterns.leaf}</Text>
            <Text style={styles.sourceText}>{source}</Text>
            <Text style={styles.ornament}>{BorderPatterns.leaf}</Text>
          </View>
        )}
      </View>

      {/* Right border decoration */}
      <View style={styles.rightBorder}>
        <Text style={styles.borderText}>{BorderPatterns.vertical}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: ManuscriptColors.oldPaper,
    borderRadius: ManuscriptSpacing.borderRadius,
    borderWidth: 2,
    borderColor: ManuscriptColors.henna,
    padding: ManuscriptSpacing.padding.medium,
    shadowColor: ManuscriptColors.scrollShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  leftBorder: {
    justifyContent: 'center',
    paddingRight: 8,
  },
  rightBorder: {
    justifyContent: 'center',
    paddingLeft: 8,
  },
  borderText: {
    fontSize: 24,
    color: ManuscriptColors.vermillion,
    fontFamily: ManuscriptFonts.decorative,
  },
  quoteContent: {
    flex: 1,
    position: 'relative',
  },
  sanskritText: {
    fontFamily: ManuscriptFonts.sanskrit,
    fontSize: ManuscriptFonts.smallSize,
    color: ManuscriptColors.indigo,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteMark: {
    position: 'absolute',
    top: -10,
    left: -8,
    fontSize: 48,
    color: ManuscriptColors.vermillion,
    fontFamily: ManuscriptFonts.decorative,
    opacity: 0.4,
  },
  quoteMarkEnd: {
    position: 'absolute',
    bottom: -20,
    right: 0,
    fontSize: 48,
    color: ManuscriptColors.vermillion,
    fontFamily: ManuscriptFonts.decorative,
    opacity: 0.4,
  },
  quoteText: {
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.bodySize,
    color: ManuscriptColors.inkBrown,
    fontStyle: 'italic',
    lineHeight: 24,
    paddingVertical: 16,
    textAlign: 'center',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sourceText: {
    fontFamily: ManuscriptFonts.body,
    fontSize: ManuscriptFonts.captionSize,
    color: ManuscriptColors.fadedInk,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  ornament: {
    fontSize: 12,
    color: ManuscriptColors.turmeric,
  },
});
