import { toast as sonnerToast } from "sonner";

export function toast({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
}) {
  sonnerToast(title, {
    description,
    duration: 3000, // 3 seconds
  });
}
