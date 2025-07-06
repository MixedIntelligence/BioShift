// Backend API configuration
const isDevelopment = process.env.NODE_ENV === "development";
const backendUrl = process.env.REACT_APP_BACKEND_URL || 
  (isDevelopment ? "http://localhost:8080" : "https://bioshift-production.up.railway.app");

const hostApi = backendUrl;
const baseURLApi = `${backendUrl}/api`;
const redirectUrl = isDevelopment ? "http://localhost:3000" : window.location.origin;

console.log('🔧 Config loaded:', { 
  NODE_ENV: process.env.NODE_ENV, 
  isDevelopment, 
  backendUrl, 
  REACT_APP_BACKEND_URL: process.env.REACT_APP_BACKEND_URL 
});

const config = {
  redirectUrl,
  hostApi,
  baseURLApi,
  remote: backendUrl,
  isBackend: true,
  auth: {
    email: 'admin@flatlogic.com',
    password: 'password'
  },
  app: {
    sidebarColors: {
      first: '#3D3D3D',
      second: '#4B505F',
      third: '#483CB6',
      fourth: '#EFF2F5',
      fifth: '#20AE8C'
    },
    navbarColors: {
      first: '#ffffff',
      second: '#E2E7EC',
      third: '#C9D1FB',
      fourth: '#C1C3CF',
      fifth: '#0C2236',
      sixth: '#6FB0F9'
    },
    colors: {
      dark: "#002B49",
      light: "#FFFFFF",
      sea: "#004472",
      sky: "#E9EBEF",
      wave: "#D1E7F6",
      rain: "#CCDDE9",
      middle: "#D7DFE6",
      black: "#13191D",
      salad: "#21AE8C",
      seaWave: "#483CB6",
      grad: "#4B505F",
      blueSky: "#EFF2F5"
    },
    themeColors: {
      primary: "#6FB0F9",
      secondary: "#798892",
      success: "#26CD5F",
      info: "#10CFD0",
      warning: "#EBB834",
      danger: "#FF5574",
      inverse: "#30324C",
      default: "#9083F7"
    },
  }
};

export default config;
