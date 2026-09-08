import PuppyLoader from "@/components/PuppyLoader";

/**
 * Dashboard layout-level loading screen.
 * Displays the Long Dog Lottie animation during page transitions.
 */
export default function DashboardLoading() {
  return (
    <PuppyLoader
      title="Loading Dashboard"
      subtitle="Gathering your claim appeals and metrics..."
      size="fullscreen"
    />
  );
}
