import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface BottomNavBarProps {
  activeTab: string;
  onTabPress: (tabName: string) => void;
}
const tabs = [
  {name: 'Scenes', icon: 'ios-film'},
  {name: 'Devices', icon: 'ios-hardware'},
  {name: 'Settings', icon: 'ios-settings'},
];

const colors = {
  icon: {
    active: '#007AFF',
    disabled: '#8E8E93',
  },
  tab: {
    active: '#007AFF',
    disabled: '#8E8E93',
  },
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({activeTab, onTabPress}) => {
  return (
    <View style={styles.container}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tabButton}
          onPress={() => onTabPress(tab.name)}>
          <Icon
            name={tab.icon}
            size={24}
            color={
              activeTab === tab.name ? colors.icon.active : colors.icon.disabled
            }
          />
          <Text
            style={[
              styles.tabText,
              {
                color:
                  activeTab === tab.name
                    ? colors.tab.active
                    : colors.tab.disabled,
              },
            ]}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default BottomNavBar;
