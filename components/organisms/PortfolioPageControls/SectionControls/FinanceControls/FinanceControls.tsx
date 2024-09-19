import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  financeDataOptions,
  updateFinanceData,
} from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import FinanceCopyInput from "./FinanceCopyInput/FinanceCopyInput";
import FinanceTypeSelect from "./FinanceTypeSelect/FinanceTypeSelect";
import FinanceAmountInput from "./FinanceAmountInput/FinanceAmountInput";

const FinanceControls: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: financeData } = useQuery(financeDataOptions);

  const updateFinanceMutation = useMutation({
    mutationFn: updateFinanceData,
    onSuccess: (newData) => {
      queryClient.setQueryData(["financeData"], newData);
    },
  });

  const handleFinanceCopyChange = (value: string) => {
    if (!financeData) return;
    updateFinanceMutation.mutate({ ...financeData, financeCopy: value });
  };

  const handleFinanceTypeChange = (value: string) => {
    if (!financeData) return;
    updateFinanceMutation.mutate({ ...financeData, financeType: value });
  };

  const handleCustomFinanceTypeChange = (value: string) => {
    if (!financeData) return;
    updateFinanceMutation.mutate({ ...financeData, customFinanceType: value });
  };

  const handleFinanceAmountChange = (value: string) => {
    if (!financeData) return;
    updateFinanceMutation.mutate({ ...financeData, financeAmount: value });
  };

  if (!financeData) return null;

  return (
    <div className="space-y-4">
      <FinanceCopyInput
        value={financeData.financeCopy}
        onChange={handleFinanceCopyChange}
      />
      <FinanceTypeSelect
        value={financeData.financeType}
        customValue={financeData.customFinanceType}
        onChange={handleFinanceTypeChange}
        onCustomChange={handleCustomFinanceTypeChange}
      />
      <FinanceAmountInput
        value={financeData.financeAmount}
        onChange={handleFinanceAmountChange}
      />
    </div>
  );
};

export default FinanceControls;
