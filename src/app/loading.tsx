import DefaultLayout from '@/layouts/DefaultLayout';
import Loading from '@/components/Loading';

export default function LoadingPage() {
  return (
    <DefaultLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loading size="lg" text="Loading BehindTheTick..." />
      </div>
    </DefaultLayout>
  );
}
