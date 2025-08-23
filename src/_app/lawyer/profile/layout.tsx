import ProfileSettingsLayout from "../profile-settings-layout";

interface LawyerProfileLayoutProps {
  children: React.ReactNode;
}

export default function LawyerProfileLayout({ children }: LawyerProfileLayoutProps) {
  return <ProfileSettingsLayout>{children}</ProfileSettingsLayout>;
}