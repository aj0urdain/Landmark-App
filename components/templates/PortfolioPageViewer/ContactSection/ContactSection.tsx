import AgentSection from "./AgentSection/AgentSection";
import SaleTypeSection from "./SaleTypeSection/SaleTypeSection";

const ContactSection = () => {
  return (
    <div
      className={`absolute right-[1.75%] top-[76%] flex h-[18%] w-[31%] flex-col items-start justify-start gap-[10%] border-l border-portfolio-border`}
    >
      <AgentSection />
      <SaleTypeSection />
    </div>
  );
};

export default ContactSection;
