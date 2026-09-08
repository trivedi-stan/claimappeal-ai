import PuppyLoader from "@/components/PuppyLoader";

/**
 * Appeals list / detail level loading screen.
 * Displays the Long Dog Lottie animation during page transitions.
 */
export default function AppealsLoading() {
  return (
    <PuppyLoader
      title="Loading Appeal Details"
      subtitle="Fetching clinical data and intake records..."
      size="fullscreen"
    />
  );
}
