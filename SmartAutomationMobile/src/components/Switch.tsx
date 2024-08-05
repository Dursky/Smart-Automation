import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Animated, StyleSheet} from 'react-native';

interface props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  disabled?: boolean;
}

export const Switch: React.FC<props> = ({
  value,
  onValueChange,
  activeColor = '#4CD964',
  inactiveColor = '#D1D1D6',
  thumbColor = '#FFFFFF',
  disabled = false,
}) => {
  const [switchAnimation] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(switchAnimation, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, switchAnimation]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const backgroundColorInterpolation = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [inactiveColor, activeColor],
  });

  const translateXInterpolation = switchAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled}>
      <Animated.View
        style={[
          styles.track,
          {backgroundColor: backgroundColorInterpolation},
          disabled && styles.disabledTrack,
        ]}>
        <Animated.View
          style={[
            styles.thumb,
            {backgroundColor: thumbColor},
            {transform: [{translateX: translateXInterpolation}]},
            disabled && styles.disabledThumb,
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 51,
    height: 31,
    borderRadius: 31,
    justifyContent: 'center',
  },
  thumb: {
    width: 27,
    height: 27,
    borderRadius: 27,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledTrack: {
    opacity: 0.5,
  },
  disabledThumb: {
    opacity: 0.5,
  },
});

export default Switch;
