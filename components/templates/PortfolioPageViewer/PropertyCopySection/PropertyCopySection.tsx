import { useQueryClient, useQuery } from "@tanstack/react-query";
import { textAlgorithm } from "@/utils/sandbox/document-generator/portfolio-page/textAlgorithm";
import { propertyCopyDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";

const PropertyCopySection = () => {
  const queryClient = useQueryClient();
  const { data: propertyCopyData } = useQuery(propertyCopyDataOptions);

  const textPropsText = textAlgorithm("propertyCopy", queryClient);
  const textPropsBullet = textAlgorithm("propertyCopyBullet", queryClient);

  // Parse the property copy string into an array of lines
  const contentBlocks = propertyCopyData?.propertyCopy
    ? propertyCopyData.propertyCopy
        .split("\n")
        .filter((line) => line.trim() !== "")
    : [
        "Place your property copy here!",
        "Each line break (new line by hitting enter) will be treated as a separate block",
        "Click the dropdown and select 'Property Copy' to start editing!",
        "No need to create new blocks, Landmark will do that for you!",
      ];

  return (
    <div
      className={`absolute left-[36.5%] top-[76%] flex h-[18%] w-[29%] flex-col items-start justify-start gap-[6%] font-normal`}
    >
      {contentBlocks.map((block, index) => (
        <div
          key={index}
          className="flex w-full items-start justify-start gap-[2.75%]"
        >
          <p
            className={`${textPropsBullet.getTailwind()}`}
            style={textPropsBullet.getStyle()}
          >
            +
          </p>
          <p
            className={`${textPropsText.getTailwind()} w-full`}
            style={textPropsText.getStyle()}
          >
            {block}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PropertyCopySection;
