import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  routeInfoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  routeInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDistance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginRight: 12,
  },
  routeDuration: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  locationInfo: {
    marginBottom: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginLeft: 5,
    marginVertical: 2,
  },
  locationText: {
    fontSize: 14,
    color: '#4B5563',
    flex: 1,
  },
  navigationButton: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  navigationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default styles; 