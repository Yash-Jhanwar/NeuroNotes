import DashboardWorkspace from '@/components/dashboard/dashboard-workspace';

type DashboardShellProps = {
  firstName?: string | null;
  primaryEmail?: string | null;
};

export default function DashboardShell({ firstName, primaryEmail }: DashboardShellProps) {
  return <DashboardWorkspace firstName={firstName} primaryEmail={primaryEmail} />;
}
