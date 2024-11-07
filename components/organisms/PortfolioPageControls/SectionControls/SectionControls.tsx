import React from 'react';
import PropertyCopyControls from './PropertyCopyControls/PropertyCopyControls';
import HeadlineControls from './HeadlineControls/HeadlineControls';
import AddressControls from './AddressControls/AddressControls';
import FinanceControls from './FinanceControls/FinanceControls';
import AgentsControls from './AgentsControls/AgentsControls';
import SaleTypeControls from './SaleTypeControls/SaleTypeControls';
import PhotoControls from './PhotosAndLogosControls/PhotoControls/PhotoControls';
import LogoControls from './PhotosAndLogosControls/LogoControls/LogoControls';
import { SectionName } from '@/types/portfolioControlsTypes';

interface SectionControlsProps {
  selectedSection: SectionName;
}

const SectionControls: React.FC<SectionControlsProps> = ({ selectedSection }) => {
  switch (selectedSection) {
    case 'Property Copy':
      return <PropertyCopyControls />;
    case 'Photos':
      return <PhotoControls />;
    case 'Logos':
      return <LogoControls />;
    case 'Headline':
      return <HeadlineControls />;
    case 'Address':
      return <AddressControls />;
    case 'Finance':
      return <FinanceControls />;
    case 'Agents':
      return <AgentsControls />;
    case 'Sale Type':
      return <SaleTypeControls />;
    default:
      return null;
  }
};

export default SectionControls;
