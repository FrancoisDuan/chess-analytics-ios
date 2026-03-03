/**
 * API base URL configuration.
 *
 * For local Expo Go development set EXPO_PUBLIC_API_URL in a .env file:
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:8000/api
 *
 * The env var is automatically available via Expo's EXPO_PUBLIC_ prefix support.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default API_URL;
