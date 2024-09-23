import PortfolioPageContent from "@/components/templates/PortfolioPageContent/PortfolioPageContent";
import { Suspense } from "react";

const PortfolioPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PortfolioPageContent />
    </Suspense>
  );
};

export default PortfolioPage;
