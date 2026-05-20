import { Alert } from "@/components/ui/alert";
import type { AlertVariant } from "@/components/ui/alert";

type FeedbackType = "success" | "warning" | "error";

function feedbackToAlertVariant(type: FeedbackType): AlertVariant {
  if (type === "error") {
    return "danger";
  }
  return type;
}

export function FeedbackAlert({
  feedback,
}: {
  feedback: { type: FeedbackType; message: string } | null;
}) {
  if (!feedback) {
    return null;
  }

  return (
    <Alert
      variant={feedbackToAlertVariant(feedback.type)}
      message={feedback.message}
    />
  );
}