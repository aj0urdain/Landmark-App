import { documentDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface AddressSectionProps {
  documentId: number;
}

const AddressSection: React.FC<AddressSectionProps> = ({ documentId }) => {
  const queryClient = useQueryClient();
  const { data: documentData } = useQuery(documentDataOptions(documentId));
  const textProps = textAlgorithm("address", queryClient);

  if (!documentData) return null;

  const { addressData } = documentData;

  return (
    <div
      className={`absolute left-[4.75%] top-[76.1%] flex h-[5.5%] w-[30%] flex-col items-start justify-center -space-y-[1.5%] border-y border-portfolio-border font-medium`}
    >
      <p className={textProps.getTailwind()} style={textProps.getStyle()}>
        {addressData.suburb || "Suburb"}
        {addressData.additional && (
          <span> ({addressData.additional || "Additional"}) </span>
        )}
        <span className="uppercase"> {addressData.state || "State"} </span>
      </p>
      <p className={textProps.getTailwind()} style={textProps.getStyle()}>
        {addressData.street || "Street Number and Name"}
      </p>
    </div>
  );
};

export default AddressSection;
