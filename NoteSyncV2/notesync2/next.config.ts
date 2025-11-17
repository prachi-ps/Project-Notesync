/*
import type { NextConfig } from "next";

const nextConfig: NextConfig = {            */
  /* config options here */                 /*
  devIndicators: false
};

export default nextConfig;
*/

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your config options here */

  devIndicators: {
    buildActivity: false, // hides build spinner
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
    ],
  },

  webpackDevMiddleware: (config: any) => {
    // Disable the red React error overlay in dev mode
    if (config.client) {
      config.client.overlay = false;
    } else {
      config.client = { overlay: false };
    }
    return config;
  },
};

export default nextConfig;

