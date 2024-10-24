import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { addressDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";

const AddressSection = () => {
  const queryClient = useQueryClient();
  const { data: addressData } = useQuery(addressDataOptions);

  const textProps = textAlgorithm("address", queryClient);

  return (
    <div
      className={`absolute left-[4.75%] top-[76.1%] flex h-[5.5%] w-[30%] flex-col items-start justify-center -space-y-[1.5%] border-y border-portfolio-border font-medium`}
    >
      <p className={textProps.getTailwind()} style={textProps.getStyle()}>
        {addressData?.suburb || "Suburb"}
        {addressData?.additional && (
          <span> ({addressData.additional || "Additional"}) </span>
        )}
        <span className="uppercase"> {addressData?.state || "State"} </span>
      </p>
      <p className={textProps.getTailwind()} style={textProps.getStyle()}>
        {addressData?.street || "Street Number and Name"}
      </p>
    </div>
  );
};

export default AddressSection;
