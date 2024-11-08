import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { SectionName } from '@/types/portfolioControlsTypes';

const LogoSection = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const selectedListingId = searchParams.get('listing') ?? null;
  const selectedDocumentType = searchParams.get('documentType') ?? null;

  const draftLogoData = queryClient.getQueryData([
    'draftLogo',
    selectedListingId,
    selectedDocumentType,
  ]);

  const { mutate: updateSelectedSection } = useMutation({
    mutationFn: (section: SectionName) => {
      queryClient.setQueryData(['selectedSection'], section);
      return Promise.resolve(section);
    },
  });

  if (
    !draftLogoData ||
    draftLogoData.logoCount === 0 ||
    !draftLogoData.logos.some((logo) => logo)
  ) {
    return null;
  }

  const renderLogos = () => {
    return draftLogoData.logos.slice(0, draftLogoData.logoCount).map((logo, index) => {
      if (!logo) return null;
      return (
        <div key={index} className="flex h-full w-full items-center justify-center">
          <img
            src={logo}
            alt={`Logo ${index + 1}`}
            className="max-h-full max-w-full object-contain group-hover:brightness-75 transition-all duration-300"
          />
        </div>
      );
    });
  };

  const logoContainerClass =
    draftLogoData.logoOrientation === 'horizontal' ? 'flex-row' : 'flex-col';

  const logoWidth = draftLogoData.logoCount === 1 ? '14%' : '28%';

  return (
    <div
      className={`absolute right-[4.75%] top-[68%] flex h-[5.5%] ${logoContainerClass} group cursor-pointer hover:scale-[1.01] transition-all duration-300`}
      style={{ width: logoWidth }}
      onClick={() => {
        updateSelectedSection('Logos' as SectionName);
      }}
    >
      {renderLogos()}
    </div>
  );
};

export default LogoSection;
