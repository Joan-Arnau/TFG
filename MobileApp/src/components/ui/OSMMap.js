import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

const OSMMap = ({ 
  markers = [], 
  initialRegion, 
  onMarkerPress,
  style,
  theme,
  webViewRef,
  detailLabel = 'Detail'
}) => {
  const primaryColor = theme?.primaryColor || '#2E7D32';
  const secondaryColor = theme?.secondaryColor || '#1565C0';

  // Generate HTML with Leaflet and custom CSS for markers
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script type="module" src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"></script>
        <script nomodule src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { height: 100vh; width: 100vw; }
          .custom-marker {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 34px !important;
            height: 34px !important;
            border-radius: 17px;
            border: 2px solid white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          }
          .shop-marker { background-color: ${primaryColor}; }
          .poi-marker { background-color: ${secondaryColor}; }
          .event-marker { background-color: #f39c12; }
          .festival-marker { background-color: #e91e63; }
          .custom-marker ion-icon { font-size: 20px; color: white; }
          .leaflet-div-icon { background: transparent; border: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            attributionControl: false
          }).setView([${initialRegion.latitude}, ${initialRegion.longitude}], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

          const markers = ${JSON.stringify(markers)};
          
          markers.forEach(m => {
            let iconName = 'location';
            let markerClass = 'poi-marker';
            
            if (m.mapType === 'shop') {
              iconName = 'cart';
              markerClass = 'shop-marker';
            } else if (m.mapType === 'event') {
              if (m.isFestival) {
                iconName = 'sparkles';
                markerClass = 'festival-marker';
              } else {
                iconName = 'calendar';
                markerClass = 'event-marker';
              }
            }

            const customIcon = L.divIcon({
              className: '',
              html: '<div class="custom-marker ' + markerClass + '"><ion-icon name="' + iconName + '"></ion-icon></div>',
              iconSize: [34, 34],
              iconAnchor: [17, 17]
            });

            const marker = L.marker([m.latitude, m.longitude], { icon: customIcon }).addTo(map);
            
            // Support both 'name' (Shops/POIs) and 'title' (Events)
            const displayName = m.name || m.title;

            if (displayName) {
              const itemJson = JSON.stringify(m).replace(/"/g, '&quot;');
              const popupContent = '<div style="text-align: center; padding: 5px;">' +
                '<b style="font-size: 14px;">' + displayName + '</b><br/>' +
                '<span style="color: #666; font-size: 12px;">' + (m.categoryName || '') + '</span><br/>' +
                '<button ' +
                  'onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: \\'MARKER_PRESS\\', id: ' + m.id + ', mapType: \\'' + m.mapType + '\\', item: ' + itemJson + '}))" ' +
                  'style="margin-top: 8px; padding: 5px 12px; background: ${primaryColor}; color: white; border: none; border-radius: 4px; font-weight: bold;"' +
                '>' + '${detailLabel}' + '</button>' +
              '</div>';
              marker.bindPopup(popupContent);
            }
          });

          window.centerMap = (lat, lon) => {
            map.flyTo([lat, lon], 16);
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'MARKER_PRESS' && onMarkerPress) {
              onMarkerPress(data);
            }
          } catch (e) {
            console.error('Error parsing map message:', e);
          }
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={primaryColor} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
});

export default OSMMap;
