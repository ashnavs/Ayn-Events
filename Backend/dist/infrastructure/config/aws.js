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
exports.uploadImage = uploadImage;
const user_random_name_generator_1 = require("user_random_name_generator");
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION + "",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY + "",
        secretAccessKey: process.env.AWS_SECRET_KEY + "",
    },
});
function uploadImage(image) {
    return __awaiter(this, void 0, void 0, function* () {
        const fileContent = fs_1.default.readFileSync(image);
        const fileName = yield (0, user_random_name_generator_1.generateName)();
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME + "",
            Key: fileName,
            Body: fileContent,
        };
        try {
            const command = new client_s3_1.PutObjectCommand(params);
            yield s3.send(command);
            return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
        }
        catch (error) {
            console.error('Error uploading file:', error);
            throw new Error('File upload failed');
        }
    });
}
