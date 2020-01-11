export const formatTime = (ms: number) =>
    ms >= 1000 ? `${ms / 1e3}s` : `${ms}ms`;
