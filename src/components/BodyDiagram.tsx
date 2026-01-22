import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Circle, Ellipse, Rect, G } from 'react-native-svg';

interface BodyDiagramProps {
  selectedRegion: string | null;
  onRegionPress: (region: string) => void;
  width?: number;
  height?: number;
}

export default function BodyDiagram({
  selectedRegion,
  onRegionPress,
  width = 300,
  height = 600
}: BodyDiagramProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (selectedRegion) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [selectedRegion]);

  const getRegionStyle = (region: string) => ({
    opacity: selectedRegion === region ? 0.7 : 0.3,
    fill: selectedRegion === region ? '#9EBF88' : '#D7CCC8',
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 300 600">
        {/* Body Outline */}
        <Path
          d="M150 40 Q140 35 135 45 Q130 55 130 70 Q130 85 135 95 Q140 105 150 110 Q160 105 165 95 Q170 85 170 70 Q170 55 165 45 Q160 35 150 40 Z"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />

        {/* Neck */}
        <Rect
          x="140"
          y="110"
          width="20"
          height="25"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />

        {/* Shoulders & Chest */}
        <Path
          d="M95 135 Q90 140 90 150 L90 200 Q90 210 100 215 L130 215 L130 200 L130 135 L95 135 Z"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />
        <Path
          d="M205 135 Q210 140 210 150 L210 200 Q210 210 200 215 L170 215 L170 200 L170 135 L205 135 Z"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />
        <Rect
          x="130"
          y="135"
          width="40"
          height="80"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />

        {/* Torso */}
        <Path
          d="M130 215 L130 350 Q130 360 135 365 L165 365 Q170 360 170 350 L170 215 Z"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />

        {/* Pelvis */}
        <Path
          d="M130 365 L130 420 Q130 430 140 435 L160 435 Q170 430 170 420 L170 365 Z"
          fill="#F5E6D3"
          stroke="#8B7355"
          strokeWidth="2"
        />

        {/* Legs */}
        <Rect x="130" y="435" width="15" height="160" fill="#F5E6D3" stroke="#8B7355" strokeWidth="2" />
        <Rect x="155" y="435" width="15" height="160" fill="#F5E6D3" stroke="#8B7355" strokeWidth="2" />

        {/* Clickable Regions with Animated Overlays */}

        {/* Head */}
        <TouchableOpacity onPress={() => onRegionPress('head')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'head' ? pulseAnim : 1 }] }}>
            <Ellipse
              cx="150"
              cy="70"
              rx="25"
              ry="35"
              {...getRegionStyle('head')}
              stroke={selectedRegion === 'head' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Eyes */}
        <TouchableOpacity onPress={() => onRegionPress('eyes')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'eyes' ? pulseAnim : 1 }] }}>
            <G>
              <Circle cx="140" cy="65" r="6" {...getRegionStyle('eyes')} />
              <Circle cx="160" cy="65" r="6" {...getRegionStyle('eyes')} />
            </G>
          </Animated.View>
        </TouchableOpacity>

        {/* Throat */}
        <TouchableOpacity onPress={() => onRegionPress('throat')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'throat' ? pulseAnim : 1 }] }}>
            <Rect
              x="140"
              y="110"
              width="20"
              height="25"
              {...getRegionStyle('throat')}
              stroke={selectedRegion === 'throat' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Chest (Heart & Lungs) */}
        <TouchableOpacity onPress={() => onRegionPress('chest')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'chest' ? pulseAnim : 1 }] }}>
            <Rect
              x="130"
              y="135"
              width="40"
              height="50"
              {...getRegionStyle('chest')}
              stroke={selectedRegion === 'chest' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
              rx="8"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Stomach */}
        <TouchableOpacity onPress={() => onRegionPress('stomach')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'stomach' ? pulseAnim : 1 }] }}>
            <Rect
              x="135"
              y="215"
              width="30"
              height="35"
              {...getRegionStyle('stomach')}
              stroke={selectedRegion === 'stomach' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
              rx="6"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Liver (Right side) */}
        <TouchableOpacity onPress={() => onRegionPress('liver')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'liver' ? pulseAnim : 1 }] }}>
            <Ellipse
              cx="155"
              cy="245"
              rx="12"
              ry="18"
              {...getRegionStyle('liver')}
              stroke={selectedRegion === 'liver' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Kidneys (Both sides) */}
        <TouchableOpacity onPress={() => onRegionPress('kidneys')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'kidneys' ? pulseAnim : 1 }] }}>
            <G>
              <Ellipse cx="138" cy="270" rx="8" ry="15" {...getRegionStyle('kidneys')} />
              <Ellipse cx="162" cy="270" rx="8" ry="15" {...getRegionStyle('kidneys')} />
            </G>
          </Animated.View>
        </TouchableOpacity>

        {/* Intestines */}
        <TouchableOpacity onPress={() => onRegionPress('intestines')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'intestines' ? pulseAnim : 1 }] }}>
            <Ellipse
              cx="150"
              cy="310"
              rx="25"
              ry="40"
              {...getRegionStyle('intestines')}
              stroke={selectedRegion === 'intestines' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Pelvis (Reproductive) */}
        <TouchableOpacity onPress={() => onRegionPress('pelvis')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'pelvis' ? pulseAnim : 1 }] }}>
            <Rect
              x="135"
              y="365"
              width="30"
              height="50"
              {...getRegionStyle('pelvis')}
              stroke={selectedRegion === 'pelvis' ? '#6B8E23' : 'transparent'}
              strokeWidth="3"
              rx="8"
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Bones (Legs) */}
        <TouchableOpacity onPress={() => onRegionPress('bones')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'bones' ? pulseAnim : 1 }] }}>
            <G>
              <Rect x="130" y="435" width="15" height="100" {...getRegionStyle('bones')} rx="6" />
              <Rect x="155" y="435" width="15" height="100" {...getRegionStyle('bones')} rx="6" />
            </G>
          </Animated.View>
        </TouchableOpacity>

        {/* Skin (Outline glow) */}
        <TouchableOpacity onPress={() => onRegionPress('skin')}>
          <Animated.View style={{ transform: [{ scale: selectedRegion === 'skin' ? pulseAnim : 1 }] }}>
            <Path
              d="M130 70 Q130 40 150 40 Q170 40 170 70 L170 420 Q170 430 150 435 Q130 430 130 420 Z"
              fill="none"
              stroke={selectedRegion === 'skin' ? '#9EBF88' : '#D7CCC8'}
              strokeWidth={selectedRegion === 'skin' ? '6' : '3'}
              opacity={selectedRegion === 'skin' ? 0.8 : 0.3}
            />
          </Animated.View>
        </TouchableOpacity>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
