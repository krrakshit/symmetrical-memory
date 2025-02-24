import { toast as sonnerToast } from "sonner";

export function toast({
  title,
  description,
  type = "default",
}: {
  title: string;
  description: React.ReactNode;
  type?: "success" | "error" | "info" | "warning" | "default"; // Add "default" here
}) {
  if (type === "success") {
    sonnerToast.success(title, { description, duration: 3000 });
  } else if (type === "error") {
    sonnerToast.error(title, { description, duration: 3000 });
  } else if (type === "info") {
    sonnerToast.info(title, { description, duration: 3000 });
  } else if (type === "warning") {
    sonnerToast.warning(title, { description, duration: 3000 });
  } else {
    sonnerToast(title, { description, duration: 3000 }); // "default" case
  }
}
