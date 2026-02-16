import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// Use TestIds.BANNER for development to avoid policy violations
const adUnitId = __DEV__ ? TestIds.BANNER : '/22846411849,23306138618/JBM_RBXRewards_Banner';

export const AdBanner = () => {
    return (
        <View style={styles.container}>
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.MEDIUM_RECTANGLE} // 300x250
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        width: '100%',
    },
});
