
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../styles/commonStyles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFilter?: () => void;
}

export default function SearchBar({ value, onChangeText, placeholder = "Search...", onFilter }: SearchBarProps) {
  return (
    <View style={commonStyles.searchContainer}>
      <Ionicons name="search" size={20} color={colors.textSecondary} />
      <TextInput
        style={commonStyles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
      />
      {onFilter && (
        <TouchableOpacity onPress={onFilter}>
          <Ionicons name="options-outline" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}
