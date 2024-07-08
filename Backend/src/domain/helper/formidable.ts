import { log } from 'console';
import { Request } from 'express';
import { IncomingForm, Fields, Files } from 'formidable';




export function multipartFormSubmission(req: Request): Promise<{ files: Files; fields: Fields }> {
    log(req,"ghfjkghdskjhf")
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err: Error | null, fields: Fields, files: Files) => {
      if (err) {
        console.error('Error parsing form:', err);
        reject(err);
      } else {
        resolve({ files, fields });
      }
    });
  });
}
