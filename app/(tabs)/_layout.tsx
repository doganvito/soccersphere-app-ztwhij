
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TabBar from '../../components/TabBar';
import { commonStyles } from '../../styles/commonStyles';

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={commonStyles.container}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
        <TabBar />
      </View>
    </GestureHandlerRootView>
  );
}
