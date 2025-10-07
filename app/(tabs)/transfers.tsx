import { colors, commonStyles } from '../../styles/commonStyles';
import { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE, DEFAULT_TRANSFER_URLS } from '../../constants';

interface Transfer {
  id: string;
  title: string;
  sourceUrl: string;
  publishedAt?: string;
}

interface ApiResponse {
  transfers: Transfer[];
  totalCount: number;
}

export default function TransfersScreen() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customUrls, setCustomUrls] = useState('');
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const shouldRefetch = () => {
    if (!lastFetchTime) return true;
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
    return (now - lastFetchTime) > twelveHours;
  };

  const fetchTransfers = useCallback(async (customFupaUrls?: string) => {
    try {
      setLoading(true);

      let fupaUrls = DEFAULT_TRANSFER_URLS.join(',');

      if (customFupaUrls?.trim()) {
        const additionalUrls = customFupaUrls.split(',').map(url => url.trim()).filter(url => url);
        fupaUrls = [...DEFAULT_TRANSFER_URLS, ...additionalUrls].join(',');
      }

      const apiUrl = `${API_BASE}/api/transfers?fupaUrl=${encodeURIComponent(fupaUrls)}`;

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      setTransfers(data.transfers || []);
      setLastFetchTime(Date.now());
    } catch (error) {
      console.error('API error:', error);
      Alert.alert('Error', 'Failed to fetch transfers. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    console.log('Refreshing transfers...');
    setRefreshing(true);
    try {
      await fetchTransfers(customUrls);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTransfers, customUrls]);

  const handleSearchWithCustomUrls = useCallback(async () => {
    await fetchTransfers(customUrls);
  }, [fetchTransfers, customUrls]);

  const openSourceUrl = (url: string) => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Could not open the source URL');
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Load transfers on component mount if needed
  useEffect(() => {
    if (shouldRefetch()) {
      fetchTransfers();
    }
  }, [fetchTransfers]);

  const renderTransfer = (transfer: Transfer) => (
    <View key={transfer.id} style={[commonStyles.card, { marginHorizontal: 0, marginBottom: 12 }]}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { marginBottom: 8 }]}>
        <Text style={[commonStyles.subtitle, { flex: 1 }]} numberOfLines={3}>
          {transfer.title}
        </Text>
        <TouchableOpacity
          onPress={() => openSourceUrl(transfer.sourceUrl)}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 6,
            marginLeft: 8,
          }}
        >
          <View style={[commonStyles.row, { alignItems: 'center' }]}>
            <Ionicons name="open" size={16} color={colors.background} />
            <Text style={{ color: colors.background, marginLeft: 4, fontSize: 12, fontWeight: '600' }}>
              Open
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[commonStyles.row, commonStyles.spaceBetween]}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12, flex: 1 }]} numberOfLines={1}>
          <Ionicons name="link" size={12} color={colors.textSecondary} /> {transfer.sourceUrl}
        </Text>
        {transfer.publishedAt && (
          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginLeft: 8 }]}>
            <Ionicons name="time" size={12} color={colors.textSecondary} /> {formatDate(transfer.publishedAt)}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <View style={[commonStyles.row, commonStyles.spaceBetween, { padding: 16, paddingBottom: 8 }]}>
        <Text style={commonStyles.title}>Transfers</Text>
        <View style={[commonStyles.row, { alignItems: 'center' }]}>
          {lastFetchTime && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12, marginRight: 8 }]}>
              Last updated: {new Date(lastFetchTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
          <View style={{
            backgroundColor: colors.primary,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}>
            <View style={[commonStyles.row, { alignItems: 'center' }]}>
              <Ionicons name="swap-horizontal" size={20} color={colors.background} />
              <Text style={{ color: colors.background, marginLeft: 4, fontWeight: '600' }}>Live</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        style={commonStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={[commonStyles.card, { backgroundColor: colors.backgroundAlt, marginBottom: 16 }]}>
          <View style={[commonStyles.row, { marginBottom: 8 }]}>
            <Ionicons name="swap-horizontal" size={20} color={colors.primary} />
            <Text style={[commonStyles.text, { marginLeft: 8, fontWeight: '600' }]}>Transfer Market</Text>
          </View>
          <Text style={[commonStyles.textSecondary, { marginBottom: 12 }]}>
            Real-time transfer news from fupa.net. Data refreshes every 12 hours.
          </Text>

          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
            Default sources:
          </Text>
          <Text style={[commonStyles.textSecondary, { fontSize: 11, marginBottom: 8 }]}>
            • https://www.fupa.net/region/rotenburg/transfers
          </Text>

          <Text style={[commonStyles.textSecondary, { fontSize: 12, marginBottom: 4 }]}>
            Additional fupa.net URLs (optional, comma-separated):
          </Text>
          <TextInput
            style={[commonStyles.input, { marginVertical: 0, fontSize: 12 }]}
            placeholder="https://www.fupa.net/region/example/transfers, ..."
            value={customUrls}
            onChangeText={setCustomUrls}
            placeholderTextColor={colors.textSecondary}
            multiline
          />

          <TouchableOpacity
            onPress={handleSearchWithCustomUrls}
            disabled={loading}
            style={{
              backgroundColor: loading ? colors.backgroundAlt : colors.secondary,
              borderRadius: 8,
              paddingVertical: 8,
              marginTop: 8,
            }}
          >
            <View style={[commonStyles.row, commonStyles.center]}>
              {loading ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <>
                  <Ionicons name="refresh" size={16} color={colors.background} />
                  <Text style={{ color: colors.background, marginLeft: 4, fontSize: 12, fontWeight: '600' }}>
                    Update Transfers
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {transfers.map(renderTransfer)}

        {transfers.length === 0 && !loading && !refreshing && (
          <View style={[commonStyles.card, commonStyles.center, { paddingVertical: 40 }]}>
            <Ionicons name="swap-horizontal" size={48} color={colors.textSecondary} />
            <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
              No transfers found
            </Text>
            <Text style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}>
              Pull to refresh or try adding additional fupa.net URLs
            </Text>
          </View>
        )}

        {loading && transfers.length === 0 && (
          <View style={[commonStyles.card, commonStyles.center, { paddingVertical: 40 }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[commonStyles.text, { marginTop: 16, textAlign: 'center' }]}>
              Loading transfers...
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}
