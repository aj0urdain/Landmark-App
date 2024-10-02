"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BasicInformation } from "@/components/organisms/CreatePage/CreateTask/BasicInformation/BasicInformation";
import { TaskDetails } from "@/components/organisms/CreatePage/CreateTask/TaskDetails/TaskDetails";
import { ApprovalSettings } from "@/components/organisms/CreatePage/CreateTask/ApprovalSettings/ApprovalSettings";
import { AdditionalInformation } from "@/components/organisms/CreatePage/CreateTask/AdditionalInformation/AdditionalInformation";
import { ReviewAndSubmit } from "@/components/organisms/CreatePage/CreateTask/ReviewAndSubmit/ReviewAndSubmit";

const steps = [
  { id: "basic", title: "Basic Information" },
  { id: "details", title: "Task Details" },
  { id: "approval", title: "Approval Settings" },
  { id: "additional", title: "Additional Information" },
  { id: "review", title: "Review and Submit" },
];

const CreateTaskPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    // Submit form data
    console.log(formData);
    // Redirect to task page
  };

  const updateFormData = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInformation
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 1:
        return (
          <TaskDetails formData={formData} updateFormData={updateFormData} />
        );
      case 2:
        return (
          <ApprovalSettings
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <AdditionalInformation
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 4:
        return <ReviewAndSubmit formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      {" "}
      {/* Adjust 4rem based on your navbar height */}
      <Card className="flex-grow animate-slide-down-fade-in overflow-hidden border">
        <CardContent className="flex h-full flex-col gap-6 pt-6">
          {/* Stepper component */}
          <div className="mb-8 flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm">{step.title}</span>
              </div>
            ))}
          </div>

          {/* Scrollable content area */}
          <div className="flex-grow overflow-y-auto">
            {/* Step content */}
            {renderStep()}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            <Button onClick={handlePrevious} disabled={currentStep === 0}>
              Previous
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Create Task</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTaskPage;
