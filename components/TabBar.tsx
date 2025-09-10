
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';
import { router, usePathname } from 'expo-router';

const tabs = [
  { name: 'home', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
  { name: 'search', icon: 'search-outline', activeIcon: 'search', label: 'Search' },
  { name: 'events', icon: 'calendar-outline', activeIcon: 'calendar', label: 'Events' },
  { name: 'transfers', icon: 'swap-horizontal-outline', activeIcon: 'swap-horizontal', label: 'Transfers' },
  { name: 'profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
];

export default function TabBar() {
  const pathname = usePathname();

  const handleTabPress = (tabName: string) => {
    console.log('Tab pressed:', tabName);
    if (tabName === 'home') {
      router.push('/home');
    } else {
      router.push(`/${tabName}`);
    }
  };

  return (
    <View style={commonStyles.tabBar}>
      <View style={[commonStyles.row, { paddingHorizontal: 8 }]}>
        {tabs.map((tab) => {
          const isActive = pathname.includes(tab.name) || (pathname === '/' && tab.name === 'home');
          return (
            <TouchableOpacity
              key={tab.name}
              style={commonStyles.tabButton}
              onPress={() => handleTabPress(tab.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.activeIcon as any : tab.icon as any}
                size={24}
                color={isActive ? colors.primary : colors.text}
              />
              <Text
                style={[
                  { fontSize: 12, marginTop: 4 },
                  { color: isActive ? colors.primary : colors.text }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
