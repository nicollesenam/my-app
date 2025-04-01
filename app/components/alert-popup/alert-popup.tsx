import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ReactNode } from "react";

interface AlertConfig {
  title: string;
  description?: string;
  icon: ReactNode;
  classAlert?: string;
  classTypeAlert?: string;
}

export default function AlertPopup({
  title,
  description,
  icon,
  classAlert,
  classTypeAlert,
}: Readonly<AlertConfig>) {
  return (
    <Alert className={classTypeAlert}>
      {icon}
      <AlertTitle className={classAlert}>{title}</AlertTitle>
      <AlertDescription className={classAlert}>{description}</AlertDescription>
    </Alert>
  );
}
