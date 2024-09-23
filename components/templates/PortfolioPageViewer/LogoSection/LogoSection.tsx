import { logoDataOptions } from "@/utils/sandbox/document-generator/portfolio-page/portfolio-queries";
import { useQuery } from "@tanstack/react-query";

const LogoSection = () => {
  const { data: logoData } = useQuery(logoDataOptions);

  if (
    !logoData ||
    logoData.logoCount === 0 ||
    !logoData.logos.some((logo) => logo)
  ) {
    return null;
  }

  const renderLogos = () => {
    return logoData.logos.slice(0, logoData.logoCount).map((logo, index) => {
      if (!logo) return null;
      return (
        <div
          key={index}
          className="flex h-full w-full items-center justify-center"
        >
          <img
            src={logo}
            alt={`Logo ${index + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      );
    });
  };

  const logoContainerClass =
    logoData.logoOrientation === "horizontal" ? "flex-row" : "flex-col";

  const logoWidth = logoData.logoCount === 1 ? "14%" : "28%";

  return (
    <div
      className={`absolute right-[4.75%] top-[68%] flex h-[5.5%] ${logoContainerClass}`}
      style={{ width: logoWidth }}
    >
      {renderLogos()}
    </div>
  );
};

export default LogoSection;
