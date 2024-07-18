// // vendorHome.jsx
// import React from 'react';
// import VendorHeader from '../../components/VendorHeader';
// import VendorLogo from '../../components/VendorLogo';
// import ImageGrid from '../../components/ImageGrid';

// function VendorHome() {
//   return (
//     <div>
//       <VendorHeader />
//       <VendorLogo/>
//       <ImageGrid vendorId={vendorId} />
//     </div>
//   );
// }

// export default VendorHome;


import React from 'react';
import VendorHeader from '../../components/VendorHeader';
import VendorLogo from '../../components/VendorLogo';
import ImageGrid from '../../components/ImageGrid';
import { useSelector } from 'react-redux';
import { selectVendor } from '../../features/vendor/vendorSlice';

function VendorHome() {
  const vendorId = useSelector(selectVendor)?.vendor?.id;

  if (!vendorId) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <VendorHeader />
      <VendorLogo />
      <ImageGrid vendorId={vendorId} />
    </div>
  );
}

export default VendorHome;

