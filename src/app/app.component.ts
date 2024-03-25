import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';
import { FileService } from './file.service';
import { saveAs } from "file-saver";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'UploadFile';
  filenames: string[] = [];
  fileStatus = { status: '', requestType: '', percent: 0 };
  constructor(private fileService: FileService) { }

  onUploadFile2(files: any): void {
    console.log(files.target.files);
    this.onUploadFile(files.target.files)
  }
  onUploadFile(files: File[]): void {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file, file.name);
    }
    this.fileService.upload(formData).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  onDownloadFile(filesname: string): void {
    this.fileService.download(filesname).subscribe(
      event => {
        console.log(event);
        this.resportProgress(event);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }
  private resportProgress(event: HttpEvent<string[] | Blob>): void {
    console.log(event);
    if (event.type == HttpEventType.UploadProgress) {
      this.updateStatus(event.loaded, event.total!, 'Uploading')
    } else if (event.type == HttpEventType.DownloadProgress) {
      this.updateStatus(event.loaded, event.total!, 'Downloading')
    } else if (event.type == HttpEventType.ResponseHeader) {
      console.log('Header returned', event);
    } else if (event.type == HttpEventType.Response) {
      if (event.body instanceof Array) {
        for (const filename of event.body) {
          this.filenames.unshift(filename)
        }
      } else {
        saveAs(new File([event.body!], event.headers.get('File-Name')!,
          { type: `${event.headers.get('Content-Type')};charset=utf-8` }
        ));
        // saveAs(new Blob([event.body!],
        //   {type:`${event.headers.get('Content-Type')};charset=utf-8`}),
        //   event.headers.get('File-Name')!);
      }
      this.fileStatus.status = 'done';
    }

  }
  private updateStatus(loaded: number, total: number, requestType: string) {
    this.fileStatus.status = 'progress';
    this.fileStatus.requestType = requestType;
    this.fileStatus.percent = Math.round(100 * loaded / total);
  }
}
