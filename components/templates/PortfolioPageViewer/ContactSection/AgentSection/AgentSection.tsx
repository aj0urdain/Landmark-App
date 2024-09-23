import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import Image from "next/image";
import { agentsDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";

const AgentSection = () => {
  const queryClient = useQueryClient();
  const { data: agentsData } = useQuery(agentsDataOptions);

  const textHeaderProps = textAlgorithm("contactHeader", queryClient);
  const textProps = textAlgorithm("agents", queryClient);

  const displayAgents = agentsData?.agents?.length
    ? agentsData.agents
    : [
        { name: "Select Agents", phone: "0400 000 000" },
        { name: "Use the picker", phone: "0400 000 000" },
        { name: "To add agents!", phone: "0400 000 000" },
      ];

  return (
    <div
      className={`flex w-full items-start justify-start gap-[0.5%] font-medium`}
    >
      <div className="flex w-full max-w-[20%] items-center justify-center">
        <Image
          src="https://dodfdwvvwmnnlntpnrec.supabase.co/storage/v1/object/public/portfolio_images/Phone@4x.png"
          alt="Phone"
          width={300}
          height={300}
          className="h-auto w-[35%]"
        />
      </div>

      <div className="flex h-full w-full flex-col items-start justify-start gap-[4.5%]">
        <p
          className={`${textHeaderProps.getTailwind()} w-full font-black`}
          style={textHeaderProps.getStyle()}
        >
          Contact
        </p>
        <div className="flex h-full w-full flex-col items-start justify-start">
          {displayAgents.map((agent, index) => (
            <p
              key={index}
              className={`${textProps.getTailwind()} w-full ${!agentsData?.agents?.length ? "text-gray-400" : ""}`}
              style={textProps.getStyle()}
            >
              {agent.name} {agent.phone}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AgentSection;
