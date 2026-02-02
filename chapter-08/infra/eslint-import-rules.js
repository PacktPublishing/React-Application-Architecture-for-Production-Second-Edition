// Generate ESLint zone rules from feature configuration
function generateImportRules() {
  const zones = [];

  // Prevent shared utilities from importing from features or app directories
  zones.push({
    target: [
      './src/components/**',
      './src/config/**',
      './src/hooks/**',
      './src/lib/**',
      './src/stores/**',
      './src/types/**',
      './src/utils/**',
    ],
    from: ['./src/features/**', './src/app/**'],
    message:
      'Shared utilities should not import from features or app directories.',
  });

  // Prevent any features from importing from app directory
  zones.push({
    target: `./src/features/**/**`,
    from: `./src/app/**/**`,
    message: `Features should not import from app directory.`,
  });

  // Feature dependency configuration
  const features = [
    {
      name: 'auth',
      allowedFeatures: [],
    },
    {
      name: 'ideas',
      allowedFeatures: ['auth'],
    },
    {
      name: 'profile',
      allowedFeatures: ['auth'],
    },
    {
      name: 'reviews',
      allowedFeatures: ['auth'],
    },
  ];

  features.forEach((feature) => {
    // Get all other features that this feature is NOT allowed to import from
    const forbiddenFeatures = features
      .filter(
        (f) =>
          f.name !== feature.name && !feature.allowedFeatures.includes(f.name),
      )
      .map((f) => f.name);

    if (forbiddenFeatures.length > 0) {
      zones.push({
        target: `./src/features/${feature.name}/**`,
        from: `./src/features/{${forbiddenFeatures.join(',')}}/**`,
        message: `${feature.name} feature should not import from ${forbiddenFeatures.join(', ')} features.`,
      });
    }
  });

  return zones;
}

export const importRules = generateImportRules();
