import ProfileSettingsLayout from "../profile-settings-layout";

interface LawyerChangePasswordLayoutProps {
  children: React.ReactNode;
}

export default function LawyerChangePasswordLayout({ children }: LawyerChangePasswordLayoutProps) {
  return <ProfileSettingsLayout>{children}</ProfileSettingsLayout>;
}
