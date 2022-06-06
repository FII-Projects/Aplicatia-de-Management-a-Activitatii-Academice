import {UploadedFile} from "express-fileupload";
import {EmailEndpointResponse} from "./models";
import {XLSXService, XLSXVerificationService} from "../services/file/xlsx.service";
import {ResponseError} from "../middleware/middleware";
import {StatusCode} from "../services/rest.util";
import {MailService} from "../services/email.service";
import {DOCXService} from "../services/file/docx.service";
import {UtilService} from "../services/util.service";

export class AdminEmailService {

    static async sendSemesterActivityEmail(emailTemplate: string, subject: string, from: string, file: UploadedFile, recipientExceptList: string[], send: boolean): Promise<EmailEndpointResponse> {
        const checkingResult = XLSXVerificationService.verifySemesterActivityTimetable(file);

        if (checkingResult != null) {
            throw new ResponseError(`Invalid file. Expected ${checkingResult.expected.join('|')} got ${checkingResult.got.join('|')}`, StatusCode.BAD_REQUEST);
        }

        const semesterActivityDataList = XLSXService.parseSemesterActivityTimetable(file);

        const emailEndpointResponse: EmailEndpointResponse = {
            emailPreview: [],
            successfulEmails: [],
        };

        for (let data of semesterActivityDataList) {
            if (recipientExceptList.some(item => item === data.emailTo)) {
                continue;
            }

            let emailActivityContent: string = data.professorActivity
                .map(item => `${item.activity} ${item.weekHours} ore/săptămână`)
                .join(`<br>`);

            const emailContent = emailTemplate.replace(new RegExp(/{{activity}}/g), emailActivityContent);

            emailEndpointResponse.emailPreview.push({
                from: from,
                to: data.emailTo,
                subject: subject,
                html: emailContent,
                attachments: [],
                cc: [],
            });

            if (!send) {
                continue;
            }
            /* Sending the email */

            try {
                await MailService.sendMail({
                    subject: subject,
                    from: from,
                    to: data.emailTo,
                    html: emailContent,
                });

                emailEndpointResponse.successfulEmails.push({email: data.emailTo, success: true});
            } catch (err) {
                console.log(err);
                emailEndpointResponse.successfulEmails.push({email: data.emailTo, success: false});
            }

        }

        return emailEndpointResponse;
    }

    static async sendVerbalProcess(emailTemplate: string, subject: string, from: string, file: UploadedFile, recipientExceptList: string[], send: boolean): Promise<EmailEndpointResponse> {
        const verbalProcessDataList = XLSXService.parseReportAnnouncement(file, true);

        const emailEndpointResponse: EmailEndpointResponse = {
            emailPreview: [],
            successfulEmails: [],
        };

        for (let data of verbalProcessDataList) {
            if (recipientExceptList.some(item => item === data.studentEmail)) {
                continue;
            }

            const buffer = await DOCXService.getVerbalProcessDOCXBuffer(data);
            const filename = `Proces_verbal_raport_${data.studentName} ${data.report}.docx`;
            const parsedSubject = `${subject} ${data.report[1]} ${data.studentName}`;

            let emailContent = emailTemplate;
            emailContent = emailContent.replace(new RegExp(/{{report}}/g), data.report[1]);
            emailContent = emailContent.replace(new RegExp(/{{studentName}}/g), data.studentName);

            emailEndpointResponse.emailPreview.push({
                from: from,
                to: data.coordinatorEmail,
                subject: parsedSubject,
                html: emailContent,
                attachments: [filename],
                cc: [],
            });

            if (!send) {
                continue;
            }

            try {
                await MailService.sendMail({
                    subject: parsedSubject,
                    from: from,
                    to: data.coordinatorEmail,
                    html: emailContent,
                    attachments: [{
                        content: buffer,
                        filename: filename,
                    }],
                });

                emailEndpointResponse.successfulEmails.push({
                    email: data.studentEmail,
                    success: true,
                });
            } catch (err) {
                console.log(err);
                emailEndpointResponse.successfulEmails.push({
                    email: data.studentEmail,
                    success: false,
                });
            }
        }

        return emailEndpointResponse;
    }

    static async sendThesisEmailNotification(emailTemplate: string, subject: string, from: string, file: UploadedFile, recipientExceptList: string[], sent: boolean, startDate: Date, endDate: Date): Promise<EmailEndpointResponse> {
        const verbalProcessDataList = XLSXService.parseReportAnnouncement(file, false, startDate, endDate);

        const emailEndpointResponse: EmailEndpointResponse = {
            emailPreview: [],
            successfulEmails: [],
        };

        for (const data of verbalProcessDataList) {
            if (recipientExceptList.some(item => item === data.studentEmail)) {
                continue;
            }

            let commission = '';
            commission += `${data.coordinators[1].coordinatorName}<br>`;
            commission += `${data.coordinators[2].coordinatorName}<br>`;
            commission += `${data.coordinators[3].coordinatorName}`;

            let emailContent = emailTemplate;
            emailContent = emailContent.replace(new RegExp(/{{date}}/g), UtilService.simpleStringDate(data.presentationDate));
            emailContent = emailContent.replace(new RegExp(/{{reportTitle}}/g), data.reportTitle);
            emailContent = emailContent.replace(new RegExp(/{{coordinator}}/g), data.coordinators[0].coordinatorName);
            emailContent = emailContent.replace(new RegExp(/{{commission}}/g), commission);

            const parsedSubject = `${subject} ${data.studentName}`;

            emailEndpointResponse.emailPreview.push({
                from: from,
                to: data.studentEmail,
                subject: parsedSubject,
                html: emailContent,
                attachments: [],
                cc: [data.coordinatorEmail],
            });

            if (!sent) {
                continue;
            }

            try {
                await MailService.sendMail({
                    subject: parsedSubject,
                    from: from,
                    to: data.studentEmail,
                    cc: [data.coordinatorEmail],
                    html: emailContent,
                });

                emailEndpointResponse.successfulEmails.push({
                    email: data.studentEmail,
                    success: true,
                });
            } catch (err) {
                console.log(err);

                emailEndpointResponse.successfulEmails.push({
                    email: data.studentEmail,
                    success: false,
                });
            }
        }

        return emailEndpointResponse;
    }


}