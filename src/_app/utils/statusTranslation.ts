export const getCaseStatusTranslation = (status: string, t: any) => {
  const statusOptions = [
    { value: "pending", label: t("lawyer.cases.statusOptions.pending") },
    { value: "in_progress", label: t("lawyer.cases.statusOptions.inProgress") },
    { value: "completed", label: t("lawyer.cases.statusOptions.completed") },
    { value: "under_review", label: t("lawyer.cases.statusOptions.underReview") },
    { value: "awaiting_documents", label: t("lawyer.cases.statusOptions.awaitingDocuments") },
    { value: "detention_confirmed", label: t("lawyer.cases.statusOptions.detentionConfirmed") },
    { value: "released", label: t("lawyer.cases.statusOptions.released") },
    { value: "deceased", label: t("lawyer.cases.statusOptions.deceased") },
    { value: "enforced_disappearance", label: t("lawyer.cases.statusOptions.enforcedDisappearance") },
    { value: "re-open", label: t("lawyer.cases.statusOptions.reOpen") },
  ];

  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
};

export const getVisitStatusTranslation = (status: string, t: any) => {
  const statusOptions = [
    { value: "todo", label: t("lawyer.visits.statusOptions.todo") },
    { value: "awaiting_confirmation", label: t("lawyer.visits.statusOptions.awaiting_confirmation") },
    { value: "in_progress", label: t("lawyer.visits.statusOptions.in_progress") },
    { value: "completed", label: t("lawyer.visits.statusOptions.completed") },
    { value: "cancelled", label: t("lawyer.visits.statusOptions.cancelled") },
    { value: "done", label: t("lawyer.visits.statusOptions.done") },
    { value: "rejected", label: t("lawyer.visits.statusOptions.rejected") },
  ];

  const statusOption = statusOptions.find(option => option.value === status);
  return statusOption ? statusOption.label : status;
};
