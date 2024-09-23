import { useQueryClient, useQuery } from "@tanstack/react-query";
import { photoDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/PortfolioQueries/portfolio-queries";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

const PhotoRender = () => {
  const queryClient = useQueryClient();
  const { data: photoData } = useQuery(photoDataOptions);

  const previewSettings = queryClient.getQueryData(["previewSettings"]) as
    | { zoom: number; pageSide?: "left" | "right"; scale: number }
    | undefined;

  const pageSide = previewSettings?.pageSide ?? "right";
  const zoom = previewSettings?.zoom ?? 1;
  const scale = previewSettings?.scale ?? 1;

  if (!photoData) return null;

  const renderPhotoLayout = () => {
    const baseClasses = `absolute ${
      pageSide === "right"
        ? "items-end justify-end pr-[4.75%]"
        : "items-end justify-start pl-[4.75%]"
    } bg-muted pb-[1.9%] font-extrabold`;

    const containerClasses = `absolute left-[4.75%] top-[6%] w-[90.5%] h-[60.25%]`;

    // Calculate the scaled border radius
    const baseRadius = 15; // Adjust this value as needed
    const scaledRadius = `${baseRadius * scale * zoom}px`;

    const roundedCornerStyle =
      pageSide === "left"
        ? { borderTopLeftRadius: scaledRadius }
        : { borderTopRightRadius: scaledRadius };

    const renderPhoto = (index: number, style: React.CSSProperties) => {
      const photo = photoData.photos[index];
      return (
        <div
          className={`${baseClasses} flex items-center justify-center`}
          style={{
            ...style,
            overflow: "hidden",
          }}
        >
          {photo?.cropped ? (
            <Image
              src={photo.cropped}
              alt={`Photo ${index + 1}`}
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <ImageIcon className="h-1/4 w-1/4 text-gray-400" />
          )}
        </div>
      );
    };

    switch (photoData.photoCount) {
      case 1:
        return (
          <div className={containerClasses}>
            {renderPhoto(0, {
              left: "0",
              top: "0",
              width: "100%",
              height: "100%",
              ...roundedCornerStyle,
            })}
          </div>
        );
      case 2:
        return (
          <div className={containerClasses}>
            {renderPhoto(0, {
              left: "0",
              top: "0",
              width: "100%",
              height: "58.91%",
              ...roundedCornerStyle,
            })}
            {renderPhoto(1, {
              left: "0",
              bottom: "0",
              width: "100%",
              height: "39.01%",
            })}
          </div>
        );
      case 3:
        return (
          <div className={containerClasses}>
            {renderPhoto(0, {
              left: "0",
              top: "0",
              width: "100%",
              height: "58.91%",
              ...roundedCornerStyle,
            })}
            {renderPhoto(1, {
              left: "0",
              bottom: "0",
              width: "49.17%",
              height: "39.01%",
            })}
            {renderPhoto(2, {
              right: "0",
              bottom: "0",
              width: "49.17%",
              height: "39.01%",
            })}
          </div>
        );
      case 4:
        return (
          <div className={containerClasses}>
            {renderPhoto(0, {
              left: "0",
              top: "0",
              width: "49.17%",
              height: "58.91%",
              ...(pageSide === "left" ? roundedCornerStyle : {}),
            })}
            {renderPhoto(1, {
              right: "0",
              top: "0",
              width: "49.17%",
              height: "58.91%",
              ...(pageSide === "right" ? roundedCornerStyle : {}),
            })}
            {renderPhoto(2, {
              left: "0",
              bottom: "0",
              width: "49.17%",
              height: "39.01%",
            })}
            {renderPhoto(3, {
              right: "0",
              bottom: "0",
              width: "49.17%",
              height: "39.01%",
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderPhotoLayout()}</>;
};

export default PhotoRender;
