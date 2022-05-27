import { Component, OnInit } from '@angular/core';
import axios, {AxiosRequestConfig} from "axios";
import {RestEndpoints} from "../../../models/rest.endpoints";
import {Cookies, CookieService} from "../../../service/cookie.service";
import {UtilService} from "../../../service/util.service";
import {EmailEndpointResponse, EmailPreview, EmailResponse} from "../../../models/models";
import {EmailTemplates} from "../email.templates";

@Component({
  selector: 'app-semester-activity',
  templateUrl: './semester-activity.component.html',
  styleUrls: ['./semester-activity.component.scss']
})
export class SemesterActivityComponent implements OnInit {
  notificationMessage = '';
  modal = false;
  modalData: EmailResponse[] = [];

  organizationEmailLoading = false;
  organizationEmailFinish = false;

  previewModalData: EmailPreview[] = [];
  previewModal = false;
  previewEmailLoading = false;
  fileStructureModal = false;

  emailFrom = EmailTemplates.FROM;
  emailSubject = EmailTemplates.SEMESTER_ACTIVITY_SUBJECT;
  emailTemplate = EmailTemplates.SEMESTER_ACTIVITY;

  filename = '';

  config: AxiosRequestConfig;

  constructor() {
    const token = CookieService.readCookie(Cookies.AUTH);
    this.config = {
      headers: {
        'Authorization': token,
      }
    };
  }

  ngOnInit(): void { }

  preRenderHtml(html: string) {
    return UtilService.preRenderHtml(html);
  }

  onSendMail(event: Event, form: HTMLFormElement, template: HTMLTextAreaElement, preview: HTMLDivElement) {
    event.preventDefault();

    const formData = new FormData(form);
    formData.set('send', `${false}`);
    formData.set('emailTemplate', preview.innerHTML.replace(new RegExp('email-key', 'g'), ''));

    this.organizationEmailLoading = true;
    this.organizationEmailFinish = false;
    this.modalData = [];
    axios.post(RestEndpoints.SEMESTER_ACTIVITY, formData, this.config)
      .then(res => {
        const data = res.data as EmailEndpointResponse;

        this.modalData = data.successfulEmails;
        this.organizationEmailFinish = true;
      }).catch(err => {
      console.log(err);
        this.notificationMessage = err.response.data;
      }).finally(() => {
        this.organizationEmailLoading = false;
      });

  }

  onPreviewEmail(event: Event, form: HTMLFormElement, template: HTMLTextAreaElement, preview: HTMLDivElement) {
    event.preventDefault();

    const formData = new FormData(form);
    formData.set('send', `${false}`);
    formData.set('emailTemplate', preview.innerHTML.replace(new RegExp('email-key', 'g'), ''));

    this.previewEmailLoading = true;

    axios.post(RestEndpoints.SEMESTER_ACTIVITY, formData, this.config)
      .then(res => {
        const data = res.data as EmailEndpointResponse;

        this.previewModalData = data.emailPreview;
        this.previewModal = true;
      }).catch(err => {
        console.log(err);
        this.notificationMessage = err.response.data;
      }).finally(() => {
        this.previewEmailLoading = false;
      });

  }

  onCloseNotification() {
    this.notificationMessage = '';
  }

  onCloseModal() {
    this.modal = false;
    this.previewModal = false;
    this.fileStructureModal = false;
  }

  onOpenModal() {
    this.modal = true;
  }

  onOpenFileStructureModal() {
    this.fileStructureModal = true;
  }

  onFileInputChange(input: HTMLInputElement) {
    const filename = UtilService.getFilenameFromInput(input);

    if (filename) {
      this.filename = filename;
    }
  }

}
