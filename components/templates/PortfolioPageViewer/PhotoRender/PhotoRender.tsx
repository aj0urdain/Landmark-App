import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { SectionName } from '@/types/portfolioControlsTypes';

const PhotoRender = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const { data: draftPhotoData } = useQuery({
    queryKey: ['draftPhoto', selectedListingId, selectedDocumentType],
  });

  const previewSettings = queryClient.getQueryData(['previewSettings']) as
    | { zoom: number; pageSide?: 'left' | 'right'; scale: number }
    | undefined;

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  const pageSide = previewSettings?.pageSide ?? 'right';
  const zoom = previewSettings?.zoom ?? 1;
  const scale = previewSettings?.scale ?? 1;

  if (!draftPhotoData) return null;

  const renderPhotoLayout = () => {
    const baseClasses = `absolute ${
      pageSide === 'right'
        ? 'items-end justify-end pr-[4.75%]'
        : 'items-end justify-start pl-[4.75%]'
    } bg-muted pb-[1.9%] font-extrabold group/photo-container transition-colors duration-300`;

    const containerClasses = `absolute left-[4.75%] top-[6%] w-[90.5%] h-[60.25%] cursor-pointer group`;

    // Calculate the scaled border radius
    const baseRadius = 15;
    const scaledRadius = `${baseRadius * scale * zoom}px`;

    const roundedCornerStyle =
      pageSide === 'left'
        ? { borderTopLeftRadius: scaledRadius }
        : { borderTopRightRadius: scaledRadius };

    const renderPhoto = (index: number, style: React.CSSProperties) => {
      const photo = draftPhotoData.photos[index];
      return (
        <div
          className={`${baseClasses} flex items-center justify-center group-hover/photo-container:scale-110`}
          style={{
            ...style,
            overflow: 'hidden',
          }}
        >
          {photo?.cropped ? (
            <Image
              src={photo.cropped}
              alt={`Photo ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="group-hover/photo-container:scale-110 transition-all duration-300"
            />
          ) : (
            <ImageIcon className="h-1/4 w-1/4 text-gray-400 group-hover/photo-container:text-warning-foreground group-hover/photo-container:scale-110 transition-all duration-300" />
          )}
        </div>
      );
    };

    const handleClick = () => {
      updateSelectedSection('Photos' as SectionName);
    };

    switch (draftPhotoData.photoCount) {
      case 1:
        return (
          <div className={containerClasses} onClick={handleClick}>
            {renderPhoto(0, {
              left: '0',
              top: '0',
              width: '100%',
              height: '100%',
              ...roundedCornerStyle,
            })}
          </div>
        );
      case 2:
        return (
          <div className={containerClasses} onClick={handleClick}>
            {renderPhoto(0, {
              left: '0',
              top: '0',
              width: '100%',
              height: '58.91%',
              ...roundedCornerStyle,
            })}
            {renderPhoto(1, {
              left: '0',
              bottom: '0',
              width: '100%',
              height: '39.01%',
            })}
          </div>
        );
      case 3:
        return (
          <div className={containerClasses} onClick={handleClick}>
            {renderPhoto(0, {
              left: '0',
              top: '0',
              width: '100%',
              height: '58.91%',
              ...roundedCornerStyle,
            })}
            {renderPhoto(1, {
              left: '0',
              bottom: '0',
              width: '49.17%',
              height: '39.01%',
            })}
            {renderPhoto(2, {
              right: '0',
              bottom: '0',
              width: '49.17%',
              height: '39.01%',
            })}
          </div>
        );
      case 4:
        return (
          <div className={containerClasses} onClick={handleClick}>
            {renderPhoto(0, {
              left: '0',
              top: '0',
              width: '49.17%',
              height: '58.91%',
              ...(pageSide === 'left' ? roundedCornerStyle : {}),
            })}
            {renderPhoto(1, {
              right: '0',
              top: '0',
              width: '49.17%',
              height: '58.91%',
              ...(pageSide === 'right' ? roundedCornerStyle : {}),
            })}
            {renderPhoto(2, {
              left: '0',
              bottom: '0',
              width: '49.17%',
              height: '39.01%',
            })}
            {renderPhoto(3, {
              right: '0',
              bottom: '0',
              width: '49.17%',
              height: '39.01%',
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
