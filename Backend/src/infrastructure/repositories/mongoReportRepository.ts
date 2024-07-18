import Report from "../database/dbmodel/reportModel";

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
            from: "vendors",
            localField: "_id",
            foreignField: "_id",
            as: "vendor"
          }
        },
        {
          $unwind: "$vendor"
        },
        {
          $project: {
            _id: 1,
            count: 1,
            reportIds: 1, 
            "vendor.name": 1
          }
        }
      ]);
  
      return reports;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };