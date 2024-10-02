import React from "react";

interface ReviewAndSubmitProps {
  formData: any;
}

export const ReviewAndSubmit: React.FC<ReviewAndSubmitProps> = ({
  formData,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review Your Task</h2>
      <div>
        <h3 className="font-semibold">Basic Information</h3>
        <p>Task Name: {formData.taskName}</p>
        <p>Description: {formData.description}</p>
      </div>
      <div>
        <h3 className="font-semibold">Task Details</h3>
        <p>Due Date: {formData.dueDate}</p>
        <p>Priority: {formData.priority}</p>
        <p>Completion Type: {formData.completion_type}</p>
      </div>
      <div>
        <h3 className="font-semibold">Assignments</h3>
        <p>Assigned Users: {formData.assignee_ids?.join(", ") || "None"}</p>
        <p>
          Assigned Departments: {formData.department_ids?.join(", ") || "None"}
        </p>
        <p>Assigned Branches: {formData.branch_ids?.join(", ") || "None"}</p>
        <p>Task Creators: {formData.creator_ids?.join(", ") || "None"}</p>
      </div>
      <div>
        <h3 className="font-semibold">Approval Settings</h3>
        <p>Requires Approval: {formData.requiresApproval ? "Yes" : "No"}</p>
        {formData.requiresApproval && (
          <>
            <p>
              Approvers: {formData.approval_assignees?.join(", ") || "None"}
            </p>
            <p>Approval Type: {formData.approval_satisfaction_type}</p>
          </>
        )}
      </div>
      <div>
        <h3 className="font-semibold">Additional Information</h3>
        <p>Tags: {formData.tags}</p>
        <p>Notes: {formData.notes}</p>
        <p>
          Dependent Tasks: {formData.depends_on_task_id?.join(", ") || "None"}
        </p>
        <p>Related Property: {formData.property_id || "None"}</p>
        <p>Attachments: {formData.attachments?.length || 0} file(s)</p>
      </div>
    </div>
  );
};
