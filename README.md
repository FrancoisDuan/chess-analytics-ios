# Chess Analytics — iOS App

A React Native / Expo mobile app that lets you explore how long chess players spend on each move. Powered by a Chess Analytics API backend.

## Tech stack

- **Expo SDK 54** (managed workflow)
- React Native 0.81 / React 19
- `axios` for API calls
- `react-native-chart-kit` + `react-native-svg` for charts
- EAS Build for App Store distribution

---

## Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 20 LTS (see `.nvmrc`) |
| npm | 10+ |
| Expo CLI | bundled via `expo` package |
| EAS CLI | `npm install -g eas-cli` (for production builds) |

Switch to the required Node version:

```bash
nvm use        # reads .nvmrc (Node 20)
```

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

Copy the example env file and set your backend URL:

```bash
cp .env.example .env
# Edit .env and set:
# EXPO_PUBLIC_API_URL=http://<your-local-ip>:8000/api
```

### 3. Start the development server

```bash
npx expo start
```

- Press **`i`** to open in iOS Simulator (requires Xcode on macOS).
- Press **`a`** to open in Android Emulator.
- Scan the QR code with the **Expo Go** app on a physical device.

---

## EAS Build — iOS (App Store)

### One-time setup

1. Create an [Expo account](https://expo.dev) if you don't have one.
2. Install EAS CLI and log in:

   ```bash
   npm install -g eas-cli
   eas login
   ```

3. Link this project to your Expo account:

   ```bash
   eas init
   ```

### Build profiles (`eas.json`)

| Profile | Purpose |
|---|---|
| `preview` | Internal distribution build (Ad Hoc / TestFlight) |
| `production` | App Store release build |

### Run a production build

```bash
npm run build:ios
# or directly:
eas build --platform ios --profile production
```

EAS will prompt for Apple credentials (Team ID, certificates, provisioning profiles) the first time.

### Run a preview / TestFlight build

```bash
npm run build:ios:preview
# or directly:
eas build --platform ios --profile preview
```

---

## App Store submission checklist

Before submitting to App Store Connect:

- [ ] **Bundle identifier** — set in `app.json` → `expo.ios.bundleIdentifier` (`com.chessanalytics.ios`). Change to your own identifier if needed.
- [ ] **Version** — bump `expo.version` (e.g. `"1.0.1"`) in `app.json` for each release.
- [ ] **Build number** — bump `expo.ios.buildNumber` (e.g. `"2"`) for each upload to App Store Connect.
- [ ] **App icon** — add a 1024×1024 PNG to `assets/icon.png` and reference it in `app.json` under `expo.icon`. See [Expo icon docs](https://docs.expo.dev/develop/user-interface/app-icons/).
- [ ] **Splash screen image** — add an image and reference it in `app.json` under `expo.splash.image`.
- [ ] **Privacy strings** — already added in `app.json` → `expo.ios.infoPlist`. Add additional strings for any permissions your build requests.
- [ ] **EAS credentials** — run `eas credentials` to verify certificates and provisioning profiles are valid.
- [ ] **Submit** — after a successful production build, run `eas submit --platform ios` or upload the `.ipa` manually in App Store Connect.

---

## Project structure

```
chess-analytics-ios/
├── App.js               # Entry point (wraps src/App.jsx in SafeAreaProvider)
├── app.json             # Expo configuration
├── eas.json             # EAS Build profiles
├── babel.config.js
├── .env.example         # Environment variable template
├── .nvmrc               # Node version (20)
└── src/
    ├── App.jsx          # Root component (tabs + state)
    ├── config.js        # API base URL from EXPO_PUBLIC_API_URL
    ├── components/      # Chart and form components
    └── services/
        └── api.js       # axios API client
```

---

## Environment variables

| Variable | Description | Default |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000/api` |

All `EXPO_PUBLIC_*` variables are automatically available in Expo's managed workflow — no extra configuration needed.
