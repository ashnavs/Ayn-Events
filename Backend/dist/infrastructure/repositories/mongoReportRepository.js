"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countReportsByVendor = exports.createReport = void 0;
const reportModel_1 = __importDefault(require("../database/dbmodel/reportModel"));
const createReport = (vendorId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const report = new reportModel_1.default({
            vendorId,
            reason,
            date: new Date()
        });
        return yield report.save();
    }
    catch (error) {
        throw new Error(`Failed to report vendor: ${error.message}`);
    }
});
exports.createReport = createReport;
const countReportsByVendor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reports = yield reportModel_1.default.aggregate([
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
                $unwind: {
                    path: "$vendor",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    count: 1,
                    reportIds: 1,
                    vendorName: "$vendor.name"
                }
            }
        ]);
        console.log(reports, "reportcount");
        return reports;
    }
    catch (error) {
        console.error("Error fetching report counts:", error.message);
        throw new Error(error.message);
    }
});
exports.countReportsByVendor = countReportsByVendor;
