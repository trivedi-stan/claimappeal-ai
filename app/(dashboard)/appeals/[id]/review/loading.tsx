import PuppyLoader from "@/components/PuppyLoader";

/**
 * Review page loading screen.
 * Displays the Long Dog Lottie animation while structured_output loads.
 */
export default function ReviewLoading() {
  return (
    <PuppyLoader
      title="Synthesizing Review"
      subtitle="Preparing legal citations and drafted rebuttal..."
      size="fullscreen"
    />
  );
}
