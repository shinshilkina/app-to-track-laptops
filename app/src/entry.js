function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
}

requireAll(require.context('./modules', true, /^\.\/(?!.*(?:__tests__)).*\.(jsx?)$/));
requireAll(require.context('./pages', true,
    /^\.\/(?!.*(?:__tests__)).*\.(jsx?)$/));