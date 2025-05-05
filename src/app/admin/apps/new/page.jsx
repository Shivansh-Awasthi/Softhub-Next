import CreateApps from './createApps';

export const metadata = {
  title: 'Create New App - Admin Dashboard',
  description: 'Add a new application or game to the platform',
};

// Simple page component that renders the CreateApps component
export default function CreateAppsPage() {
  return (
    <div className="py-8">
      <CreateApps />
    </div>
  );
}
