// Calculates distance in km between two coordinate points using Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const formatDistance = (km, t) => {
  if (km == null) return '---';
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return t ? t('distance.meters', { value: meters }) : `${meters}m`;
  }
  const kmValue = km.toFixed(1);
  return t ? t('distance.kilometers', { value: kmValue }) : `${kmValue}km`;
};
