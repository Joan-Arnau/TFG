import { useMemo, useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const OSMMap = ({ 
  markers = [], 
  userLocation, 
  center, // Explicit center prop
  initialRegion, 
  onMarkerPress,
  style,
  theme,
  webViewRef: externalRef,
  detailLabel = 'Detalls',
  interactive = false
}) => {
  const primaryColor = theme?.primaryColor || '#2E7D32';
  const secondaryColor = theme?.secondaryColor || '#1565C0';
  const internalRef = useRef(null);
  const webViewRef = externalRef || internalRef;
  const markerSize = 32;
  const markerAnchor = markerSize / 2;
  const userMarkerSize = 16;
  const userMarkerBorder = 3;
  const userMarkerOuterSize = userMarkerSize + userMarkerBorder * 2;
  const userMarkerAnchor = userMarkerOuterSize / 2;

  // Determine actual start coordinates
  const startLat = center?.latitude || initialRegion?.latitude || 41.1544;
  const startLon = center?.longitude || initialRegion?.longitude || 1.2450;

  // Icons
  const shopIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`;
  const poiIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const eventIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>`;
  const festivalIconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`;

  const mapHtml = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" />
          <style>
            html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background-color: #e5e5e5; }
            .custom-marker {
              display: flex; justify-content: center; align-items: center;
              width: ${markerSize}px !important; height: ${markerSize}px !important;
              box-sizing: border-box;
              border-radius: 50%; border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            }
            .shop-marker { background-color: ${primaryColor}; }
            .poi-marker { background-color: ${secondaryColor}; }
            .event-marker { background-color: #f39c12; }
            .festival-marker { background-color: #e91e63; }
            .user-marker { background-color: #2196F3; width: ${userMarkerSize}px !important; height: ${userMarkerSize}px !important; border: ${userMarkerBorder}px solid white; box-sizing: border-box; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js"></script>
          <script>
            var map;
            var userMarker;
            var markersData = ${JSON.stringify(markers)};

            function init() {
              if (typeof L === 'undefined') { setTimeout(init, 100); return; }

              map = L.map('map', {
                zoomControl: false,
                attributionControl: false,
                dragging: ${interactive},
                scrollWheelZoom: ${interactive},
                doubleClickZoom: ${interactive},
                touchZoom: ${interactive},
                keyboard: ${interactive}
              });

              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

              // Add markers first
              markersData.forEach(function(m) {
                var markerClass = 'poi-marker';
                var iconSvg = '${poiIconSvg}';
                if (m.mapType === 'shop') { markerClass = 'shop-marker'; iconSvg = '${shopIconSvg}'; }
                else if (m.mapType === 'event') {
                  markerClass = m.isFestival ? 'festival-marker' : 'event-marker';
                  iconSvg = m.isFestival ? '${festivalIconSvg}' : '${eventIconSvg}';
                }

                L.marker([parseFloat(m.latitude), parseFloat(m.longitude)], {
                  icon: L.divIcon({ 
                    className: 'custom-marker ' + markerClass,
                    html: iconSvg,
                    iconSize: [${markerSize}, ${markerSize}],
                    iconAnchor: [${markerAnchor}, ${markerAnchor}]
                  })
                }).addTo(map).bindPopup('<div style="text-align:center;font-family:sans-serif;min-width:100px;">' +
                  '<b>'+(m.name || m.title || '')+'</b><br/>' +
                  '<button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type:\\'MARKER_PRESS\\',id:'+m.id+',mapType:\\''+m.mapType+'\\',item: '+JSON.stringify(m).replace(/"/g, '&quot;') +'}))" ' +
                  'style="margin-top:8px;padding:6px 10px;background:${primaryColor};color:white;border:none;border-radius:4px;font-weight:bold;">${detailLabel}</button></div>');
              });

              // Center map directly using setView — avoids fitBounds padding
              // miscalculation when the container has a fixed/clipped height.
              function centerMapOnMarker() {
                try {
                  map.invalidateSize(true);
                  map.setView([${startLat}, ${startLon}], 15, { animate: false });
                } catch(e) {
                  console.log('Error centering map:', e);
                }
              }

              // Repeat to ensure the WebView has fully settled its dimensions
              centerMapOnMarker();
              setTimeout(centerMapOnMarker, 150);
              setTimeout(centerMapOnMarker, 400);

              window.centerMap = function(lat, lon) {
                map.flyTo([parseFloat(lat), parseFloat(lon)], 16);
              };

              window.updateUserLocation = function(lat, lon) {
                if (userMarker) {
                  userMarker.setLatLng([parseFloat(lat), parseFloat(lon)]);
                } else {
                  userMarker = L.marker([parseFloat(lat), parseFloat(lon)], {
                    icon: L.divIcon({
                      className: 'custom-marker user-marker',
                      iconSize: [${userMarkerOuterSize}, ${userMarkerOuterSize}],
                      iconAnchor: [${userMarkerAnchor}, ${userMarkerAnchor}]
                    })
                  }).addTo(map);
                }
              };
            }
            init();
          </script>
        </body>
      </html>
    `;
  }, [
    markers,
    primaryColor,
    secondaryColor,
    detailLabel,
    startLat,
    startLon,
    interactive,
    shopIconSvg,
    poiIconSvg,
    eventIconSvg,
    festivalIconSvg,
    markerSize,
    markerAnchor,
    userMarkerSize,
    userMarkerBorder,
    userMarkerOuterSize,
    userMarkerAnchor
  ]);

  useEffect(() => {
    if (userLocation && webViewRef.current) {
      webViewRef.current.injectJavaScript(`if(window.updateUserLocation) window.updateUserLocation(${userLocation.latitude}, ${userLocation.longitude}); true;`);
    }
  }, [userLocation, webViewRef]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        androidLayerType="hardware"
        onMessage={(event) => {
          try {
            const msg = JSON.parse(event.nativeEvent.data);
            if (msg.type === 'MARKER_PRESS' && onMarkerPress) {
              onMarkerPress(msg);
            }
          } catch (error) {
            console.debug('OSMMap message parse error', error);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // No minHeight here — the parent (mapContainer) defines the height.
    // A fixed minHeight caused the WebView to render taller than the
    // visible clipped area, shifting the Leaflet centre point downward.
    backgroundColor: '#eee',
    overflow: 'hidden'
  }
});

export default OSMMap;
