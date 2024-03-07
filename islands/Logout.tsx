import ConfirmDialog, { ConfirmDialogProps } from "$/islands/ConfirmDialog.tsx";
import { Route } from "$/shared/route.ts";

export type LogoutProps = ConfirmDialogProps;

export default function Logout({ children, ...props }: LogoutProps) {
  return (
    <ConfirmDialog
      action={Route.Logout}
      confirmText="Logout"
      title="Are you sure you want to logout?"
      {...props}
    >
      {children || "Logout"}
    </ConfirmDialog>
  );
}
