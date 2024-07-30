import Report from "../database/dbmodel/reportModel";
import { Vendor } from "../database/dbmodel/vendorModel";

export const createReport = async(vendorId:string,reason:string) => {
    try {
        const report = new Report({
            vendorId,
            reason,
            date: new Date()
        })

        return await report.save()
    } catch (error:any) {
        throw new Error(`Failed to report vendor: ${error.message}`);

    }
}



// export const countReportsByVendor = async() => {
//     return Report.aggregate([
//         {
//             $group:{
//                 _id:'$vendorId',
//                 count: {$sum:1}
//             }
//         }
//     ])
// }

// export const countReportsByVendor = async () => {
//     try {
//       const reports = await Report.aggregate([
//         {
//           $group: {
//             _id: "$vendorId",
//             count: { $sum: 1 },
//             reportIds: { $push: "$_id" } 
//           }
//         },
//         {
//           $lookup: {
//             from: "vendors",
//             localField: "_id",
//             foreignField: "_id",
//             as: "vendor"
//           }
//         },
//         {
//           $unwind: "$vendor"
//         },
//         {
//           $project: {
//             _id: 1,
//             count: 1,
//             reportIds: 1, 
//             "vendor.name": 1
//           }
//         }
//       ]);
//       console.log(reports,"reportcount")
//       return reports;
      
//     } catch (error: any) {
//       throw new Error(error.message);
//     }
//   };






export const countReportsByVendor = async () => {
  try {
    const reports = await Report.aggregate([
      {
        $group: {
          _id: "$vendorId",
          count: { $sum: 1 },
          reportIds: { $push: "$_id" }
        }
      },
      {
        $lookup: {
          from: "vendors", // Ensure this is the correct collection name
          localField: "_id",
          foreignField: "_id",
          as: "vendor"
        }
      },
      {
        $unwind: {
          path: "$vendor",
          preserveNullAndEmptyArrays: true // Preserve documents without matching vendors
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          reportIds: 1,
          // vendorName: { $arrayElemAt: ["$vendor.name", 0] } || 'undefined'
          vendorName: "$vendor.name"
        }
      }
    ]);

    console.log(reports, "reportcount");
    return reports;

  } catch (error: any) {
    console.error("Error fetching report counts:", error.message);
    throw new Error(error.message);
  }
};




