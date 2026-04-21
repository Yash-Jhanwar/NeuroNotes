import { auth, currentUser } from '@clerk/nextjs/server';
import DashboardShell from '@/components/dashboard/dashboard-shell';

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    return redirectToSignIn();
  }

  const user = await currentUser();
  const primaryEmail = user?.emailAddresses.find(
    (email) => email.id === user.primaryEmailAddressId
  )?.emailAddress;

  return (
    <DashboardShell
      firstName={user?.firstName}
      primaryEmail={primaryEmail}
    />
  );
}
